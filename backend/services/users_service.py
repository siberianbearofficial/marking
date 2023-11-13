import os
import bcrypt

from fastapi import HTTPException

from repositories.users_repository import UsersRepository

from models.sing_up_request_model import SignUpRequestModel
from models.change_password_request_model import ChangePasswordRequestModel


from config import SECRET

class UsersService:
    def __init__(self, repository: UsersRepository):
        self.repository = repository

    SECRET = SECRET
    
    def is_taken(self, username: str):
        try:
            if self.repository.get_user_by_username(username):
                return True
            return False
        except HTTPException:
            raise HTTPException(status_code=503, detail="No access to DB")

    def sign_up_user(self, sign_up_request_model: SignUpRequestModel):
        if self.repository.get_user_by_username(sign_up_request_model.username):
            raise HTTPException(status_code=409, detail="HTTP_409_CONFLICT")
        else:
            print('only client-hashed password', sign_up_request_model.password)
            self.repository.add_user(sign_up_request_model.uuid,
                                     sign_up_request_model.username,
                                     bcrypt.hashpw(sign_up_request_model.password.encode(),
                                                   bcrypt.gensalt()).decode(),
                                     False,
                                     [])

    def get_users_all(self, is_admin: bool, username: str, uuid: str = None):
        print(is_admin, username, uuid)
        try:
            if is_admin is True:
                users = self.repository.get_users_admin()
                if username is not None:
                    return self.sort_by_username(username, users)
                return users
            if is_admin is False and uuid is None:
                users = self.repository.get_users()
                if username is not None:
                    return self.sort_by_username(username, users)
                return users
            if is_admin is False and uuid is not None:
                users = self.repository.get_users_auth(uuid)
                if username is not None:
                    return self.sort_by_username(username, users)
                return users
        except HTTPException(status_code=503, detail="No connection to DB"):
            raise HTTPException(status_code=503, detail="No connection to DB")
        except HTTPException(status_code=404, detail="Not found"):
            raise HTTPException(status_code=404, detail="Not found")

    def sort_by_username(self, username: str, users):
        lst = []
        for user in users:
            if user['username'] == username:
                lst.append(user)
        return lst

    def get_user(self, is_admin: bool, uuid: str):
        try:
            if is_admin is True:
                return self.repository.get_user_one_full(uuid)
            if is_admin is False:
                return self.repository.get_user_one(uuid)
        except HTTPException(status_code=503, detail="No connection to DB"):
            raise HTTPException(status_code=503, detail="No connection to DB")
        except HTTPException(status_code=404, detail="Not found"):
            raise HTTPException(status_code=404, detail="Not found")

    def change_password_user(self, change_password_request_model: ChangePasswordRequestModel,
                             user: dict):
        if bcrypt.checkpw(change_password_request_model.current_password.encode(), user['password'].encode()):
            user['password'] = bcrypt.hashpw(change_password_request_model.new_password.encode(),
                                             bcrypt.gensalt()).decode()
            self.repository.put_user(user['uuid'], user)
            return

    def delete_account_user(self,
                            uuid: str):
        self.repository.delete_user(uuid)
        return
