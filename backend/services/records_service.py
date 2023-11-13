import json
import os
from typing import Annotated
from fastapi import HTTPException
from fastapi.params import Form

from repositories.records_repository import RecordsRepository
from repositories.users_repository import UsersRepository

from find_barcode import detect_barcode_zone
from find_logo import detect_logo_zone

from entities.record_entity import RecordEntity
from models.record_model import RecordModel

from config import SECRET

class RecordsService:
    SECRET = SECRET

    def __init__(self, repository: RecordsRepository):
        self.repository = repository

    def update(self, rec: RecordEntity):
        uuid = rec.uuid
        try:
            dict_to_update = self.repository.find_record(uuid)
        except Exception:
            raise HTTPException(status_code=404, detail="No such id")
        try:
            # Фотографии должны обрабатываться здесь с учетом внесенных пользователей корректировок 
            rec.quadrilateral_barcode, rec.barcode_score = detect_barcode_zone(f'/static/images/{uuid}/photo.png',
                                                                           f'/static/images/{uuid}/ideal.png')
            rec.quadrilateral_barcode = rec.quadrilateral_list_to_dict(rec.quadrilateral_barcode)

            rec.quadrilateral_logo, rec.logo_score = detect_logo_zone(f'/static/images/{uuid}/ideal.png', 
                                                                      f'/static/images/{uuid}/photo.png')
            rec.quadrilateral_logo = rec.quadrilateral_list_to_dict(rec.quadrilateral_logo)
            
        except Exception:
            raise HTTPException(status_code=404, detail="Pictures not found")

        dict_with_updates = rec.to_dict()
        for key in dict_to_update.keys():
            if dict_with_updates.get(key, None) is not None:
                dict_to_update[key] = dict_with_updates[key]
        self.repository.update_record(dict_to_update)
        return dict_to_update

    def update_record(self, record_entity: RecordEntity,
                      uuids: list):
        if record_entity.uuid in uuids:
            record_dict = self.repository.find_record(record_entity.uuid)
            if record_dict:
                return self.update(record_entity)
            raise HTTPException(404, 'NOT_FOUND')
        raise HTTPException(403, 'FORBIDDEN')

    def get_records(self, uuids: list = None):
        all_records = self.repository.get_records()

        if uuids is None:
            return all_records

        result = []
        for record in all_records:
            if record['uuid'] in uuids:
                result.append(record)
        return result

    def get_all(self, uuids: list):
        return self.get_records(uuids)

    def delete_record(self, uuid):
        records = self.get_records()
        for record in records:
            if record['uuid'] == uuid:
                self.repository.delete_record(uuid)
                return record

    def delete_records(self, uuid: str,
                       user: dict):
        uuids = user['records_id_list']
        if uuid in uuids:
            record_dict = self.delete_record(uuid)
            if not record_dict:
                raise HTTPException(404, 'NOT_FOUND')
            uuids.remove(uuid)
            user['records_id_list'] = uuids
            UsersRepository().put_user(user['uuid'], user)
            return
        raise HTTPException(403, 'FORBIDDEN')

    def post_records(self,
                     uuid: Annotated[str, Form()],
                     user: dict):
        user['records_id_list'].append(uuid)
        UsersRepository().put_user(user['uuid'], user)
        record = RecordModel(uuid=uuid, user_id=user['uuid'])

        quadrilateral_struct_barcode, record.barcode_score = detect_barcode_zone(
            f'/static/images/{uuid}/photo.png', f'/static/images/{uuid}/ideal.png')
        record.quadrilateral_barcode = record.set_quadrilaterals(
            quadrilateral_struct_barcode)
        
        quadrilateral_struct_logo, record.logo_score = detect_logo_zone(
            f'/static/images/{uuid}/ideal.png', f'/static/images/{uuid}/photo.png')
        record.quadrilateral_logo = record.set_quadrilaterals(
            quadrilateral_struct_logo)
        
        self.repository.add_record(uuid, record.quadrilateral_barcode,
                                   record.barcode_score, record.quadrilateral_logo, record.logo_score, False, record.user_id)
        return record
