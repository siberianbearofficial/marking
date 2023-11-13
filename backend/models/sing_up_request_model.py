from pydantic import BaseModel
from uuid import uuid4


class SignUpRequestModel(BaseModel):
    uuid: str | None = None
    username: str
    password: str

    def set_uuid(self):
        self.uuid = str(uuid4())
