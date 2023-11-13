import datetime
import json
import os
from typing import Annotated, Union

import bcrypt
import jwt
from fastapi import HTTPException, Header

from repositories.users_repository import UsersRepository
from entities.user_entity import UserEntity
from models.sing_in_request_model import SignInRequestModel

from config import SECRET

class AuthService:
    SECRET = SECRET

    def __init__(self, users_repository: UsersRepository):
        self.users_repository = users_repository

    def signed_in_user(self, authorization: Annotated[Union[str, None], Header()]):
        try:
            token = authorization.split()[1]
            payload = jwt.decode(token, self.SECRET, algorithms=['HS256'])
            user = self.users_repository.get_user(payload['sub'])
            if user is not None:
                user_entity = UserEntity(user['uuid'],
                                         user['username'],
                                         user['password'],
                                         user['is_admin'],
                                         user['records_id_list'])
                return user_entity
            return None
        except Exception as ex:
            return None

    def sign_in_user(self, sign_in_request_model: SignInRequestModel):
        user = self.users_repository.get_user_by_username(sign_in_request_model.username)
        if user and bcrypt.checkpw(sign_in_request_model.password.encode(), user['password'].encode()):
            payload = {
                'exp': (now := datetime.datetime.now()).replace(year=now.year + 3).timestamp(),
                'sub': user['uuid'],
                'is_admin': user['is_admin']
            }
            encoded_jwt = jwt.encode(payload, self.SECRET, algorithm='HS256')
            payload.update({'access_token': encoded_jwt, 'token_type': 'Bearer'})
            return payload
        elif user:
            raise HTTPException(status_code=401, detail="HTTP_401_UNAUTHORIZED")
        else:
            raise HTTPException(status_code=404, detail="NOT_FOUND")
