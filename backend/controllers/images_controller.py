import json
from fastapi import status

from services.auth_service import AuthService
from repositories.users_repository import UsersRepository


class ImagesController:
    def __init__(self):
        self.auth_service = AuthService(UsersRepository())

    def get_image_url(self, uuid, name, response, authorization):
        if user := self.auth_service.signed_in_user(authorization):
            response.status_code = status.HTTP_200_OK
            return json.dumps({'image_url': f'/static/images/{uuid}/{name}.png'})
        response.status_code = status.HTTP_401_UNAUTHORIZED
