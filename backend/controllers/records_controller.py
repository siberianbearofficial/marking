from typing import Union, Annotated
from uuid import uuid4

from fastapi import Header, status, HTTPException, File, Form
from starlette.responses import Response

from services.images_service import *
from repositories.records_repository import RecordsRepository
from repositories.users_repository import UsersRepository
from models.record_model import RecordModel

from entities.record_entity import RecordEntity
from services.auth_service import AuthService
from services.records_service import RecordsService
from services.users_service import UsersService
from services.images_service import ImagesService


class RecordsController:
    def __init__(self):
        self.auth_service = AuthService(UsersRepository())
        self.users_service = UsersService(UsersRepository())
        self.records_service = RecordsService(RecordsRepository())
        self.images_service = ImagesService()

    def update_with_auth(self, record_model: RecordModel,
                         response: Response,
                         authorization: Annotated[Union[str, None], Header()]):
        if user := self.auth_service.signed_in_user(authorization):

            uuids = user.records_id_list
            entity = RecordEntity(record_model.uuid, record_model.quadrilateral_barcode, 
                                  record_model.barcode_score, record_model.quadrilateral_logo, 
                                  record_model.logo_score, record_model.approved, record_model.user_id)

            res = self.records_service.update_record(entity, uuids)
            response.status_code = status.HTTP_200_OK
            return res
        response.status_code = status.HTTP_401_UNAUTHORIZED

    def get_with_auth(self, response: Response,
                      authorization: Annotated[Union[str, None], Header()]):
        if user := self.auth_service.signed_in_user(authorization):
            if user.is_admin is True:
                res = self.records_service.get_records()
                response.status_code = status.HTTP_200_OK
                return res
            uuids = user.records_id_list
            res = self.records_service.get_all(uuids)
            response.status_code = status.HTTP_200_OK
            return res
        response.status_code = status.HTTP_401_UNAUTHORIZED

    def delete_records_auth(self, uuid: str,
                            response: Response,
                            authorization: Annotated[Union[str, None], Header()]):
        if user := self.auth_service.signed_in_user(authorization):
            self.images_service.remove_images(uuid)
            self.records_service.delete_records(uuid, user.to_dict())
            response.status_code = status.HTTP_200_OK
            return
        response.status_code = status.HTTP_401_UNAUTHORIZED

    def post_records_with_auth(self, ideal: Annotated[bytes, File()],
                               photo: Annotated[bytes, File()],
                               response: Response,
                               authorization: Annotated[Union[str, None], Header()]):
        if user := self.auth_service.signed_in_user(authorization):
            try:
                uuid = str(uuid4())
                self.images_service.save_photo(uuid, photo)
                self.images_service.save_ideal(uuid, ideal)
                res = self.records_service.post_records(uuid, user.to_dict())
                res.logo_score = str(res.logo_score)
                res.barcode_score = str(res.barcode_score)
            except Exception as ex:
                response.status_code = status.HTTP_409_CONFLICT
                return
            else:
                response.status_code = status.HTTP_200_OK
                return res
        response.status_code = status.HTTP_401_UNAUTHORIZED
