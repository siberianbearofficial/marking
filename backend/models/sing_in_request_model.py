from pydantic import BaseModel


class SignInRequestModel(BaseModel):
    username: str
    password: str
