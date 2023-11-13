from typing import Annotated, Union
from fastapi import FastAPI, Header, File, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import Response as Resp
from models.record_model import RecordModel
from models.sing_up_request_model import SignUpRequestModel
from models.sing_in_request_model import SignInRequestModel
from models.change_password_request_model import ChangePasswordRequestModel
from controllers.users_controller import UsersController
from controllers.records_controller import RecordsController
from controllers.images_controller import ImagesController

app = FastAPI(
    title='Marking'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.mount("/static", StaticFiles(directory="/static"), name="static")


@app.get('')
async def ping():
    return '200 OK'


@app.put('/records')
async def put_records_handler(record_model: RecordModel,
                              response: Resp,
                              authorization: Annotated[Union[str, None], Header()]):
    get_updates = RecordsController().update_with_auth(record_model,
                                                       response, authorization)
    return get_updates


@app.get('/records')
async def get_records_handler(response: Resp,
                              authorization: Annotated[Union[str, None], Header()],):
    get_by_uuid = RecordsController().get_with_auth(response, authorization)
    return get_by_uuid


@app.delete('/records/{uuid}')
async def delete_records_handler(uuid: str,
                                 response: Resp,
                                 authorization: Annotated[Union[str, None], Header()]):
    RecordsController().delete_records_auth(uuid, response, authorization)
    response.status_code = status.HTTP_204_NO_CONTENT
    return


@app.post('/records')
async def post_records_handler(ideal: Annotated[bytes, File()],
                               photo: Annotated[bytes, File()],
                               response: Resp,
                               authorization: Annotated[Union[str, None], Header()],
                               ):
    post = RecordsController().post_records_with_auth(ideal, photo,
                                                      response, authorization)
    return post


# -------------------------------------------------------------------------


@app.get('/users')
async def get_users(authorization: Annotated[str | None, Header()] = None, username: str = ''):
    users = UsersController().get_users(authorization, username)
    return users


@app.get('/users/{uuid}')
async def get_user(response: Resp, authorization: Annotated[Union[str, None], Header()]):
    users = UsersController().get_user(response, authorization)
    return users


@app.post('/users')
async def sign_up_handler(sign_up_request_model: SignUpRequestModel, response: Resp):
    sing_up_user = UsersController().sign_up_with_service(sign_up_request_model, response)
    return sing_up_user


@app.post('/sign-in')
async def sign_in_handler(sign_in_request_model: SignInRequestModel, response: Resp):
    sin_in_user = UsersController().sign_in_with_service(sign_in_request_model, response)
    return sin_in_user


@app.put('/users/{uuid}/password')
async def change_password_handler(uuid: str, change_password_request_model: ChangePasswordRequestModel,
                                  response: Resp,
                                  authorization: Annotated[Union[str, None], Header()]):
    change_password_request = UsersController().change_password_with_auth(
        uuid, change_password_request_model, response,
        authorization)
    return change_password_request


@app.delete('/users/{uuid}')
async def delete_account_handler(uuid: str, response: Resp,
                                 authorization: Annotated[Union[str, None], Header()]):
    UsersController().delete_account_with_auth(uuid, response, authorization)
    response.status_code = status.HTTP_204_NO_CONTENT
    return


@app.get('/images/{uuid}/{name}')
async def images_handler(uuid: str, name: str, response: Resp,
                         authorization: Annotated[Union[str, None], Header()]):
    return ImagesController().get_image_url(uuid, name, response, authorization)
