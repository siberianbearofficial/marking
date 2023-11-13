import json
from typing import Union, Annotated

from fastapi import Header
from starlette import status
from starlette.responses import Response

from repositories.users_repository import UsersRepository
from models.change_password_request_model import ChangePasswordRequestModel
from models.sing_in_request_model import SignInRequestModel
from models.sing_up_request_model import SignUpRequestModel
from services.auth_service import AuthService
from services.users_service import UsersService

from controllers.records_controller import RecordsController


class UsersController:
    def __init__(self):
        self.auth_service = AuthService(UsersRepository())
        self.user_service = UsersService(UsersRepository())

    def get_users(self, authorization: str | None, username: str):
        if user := self.auth_service.signed_in_user(authorization):
            if user.is_admin is True:
                res = self.user_service.get_users_all(True, username)
                return res
            res = self.user_service.get_users_all(False, username, user.uuid)
            return res
        res = self.user_service.get_users_all(False, username)
        return res

    def get_user(self, response: Response, authorization: Annotated[Union[str, None], Header()]):
        if user := self.auth_service.signed_in_user(authorization):
            if user.is_admin is True:
                res = self.user_service.get_user(True, user.uuid)
                response.status_code = status.HTTP_200_OK
                return res
            res = self.user_service.get_user(False, user.uuid)
            response.status_code = status.HTTP_200_OK
            return res
        res = self.user_service.get_user(False, user.uuid)
        response.status_code = status.HTTP_200_OK
        return res

    def sign_up_with_service(self, sign_up_request_model: SignUpRequestModel, response: Response):
        sign_up_request_model.set_uuid()
        print(sign_up_request_model)
        sing_up_user_request = self.user_service.sign_up_user(
            sign_up_request_model)
        response.status_code = status.HTTP_201_CREATED
        return sing_up_user_request

    def sign_in_with_service(self, sign_in_request_model: SignInRequestModel, response: Response):
        sing_in_user = self.auth_service.sign_in_user(sign_in_request_model)
        response.status_code = status.HTTP_200_OK
        return sing_in_user

    def change_password_with_auth(self, uuid: str, change_password_request_model: ChangePasswordRequestModel,
                                  response: Response,
                                  authorization: Annotated[Union[str, None], Header()]):
        if user := self.auth_service.signed_in_user(authorization):
            if user.uuid != uuid:
                response.status_code = status.HTTP_403_FORBIDDEN
                return
            response.status_code = status.HTTP_200_OK
            return self.user_service.change_password_user(change_password_request_model, user.to_dict())
        response.status_code = status.HTTP_401_UNAUTHORIZED

    def delete_all_records(self, user, response: Response,
                           authorization: Annotated[Union[str, None], Header()]):
        records_controller = RecordsController()
        for record_id in user.records_id_list:
            records_controller.delete_records_auth(
                record_id, response, authorization)
        return

    def delete_account_with_auth(self, uuid: str, response: Response,
                                 authorization: Annotated[Union[str, None], Header()]):
        if user := self.auth_service.signed_in_user(authorization):
            if user.uuid != uuid and user.is_admin is not True:
                response.status_code = status.HTTP_403_FORBIDDEN
                return
            if user.uuid != uuid and user.is_admin is True:
                response.status_code = status.HTTP_200_OK
                self.delete_all_records(user, response, authorization)
                return self.user_service.delete_account_user(uuid)
            response.status_code = status.HTTP_200_OK
            self.delete_all_records(user, response, authorization)
            return self.user_service.delete_account_user(uuid)
        response.status_code = status.HTTP_401_UNAUTHORIZED
