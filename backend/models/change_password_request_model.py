from pydantic import BaseModel


class ChangePasswordRequestModel(BaseModel):
    current_password: str
    new_password: str
