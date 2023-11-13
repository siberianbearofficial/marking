from json import loads


class UserEntity:

    def __init__(self, uuid: str, username: str, password: str, is_admin: bool, records_id_list: str | list):
        self.uuid = uuid
        self.username = username
        self.password = password
        self.is_admin = is_admin
        if isinstance(records_id_list, str):
            self.records_id_list = loads(records_id_list)
        elif records_id_list:
            self.records_id_list = records_id_list
        else:
            self.records_id_list = []

    def to_dict(self):
        return {'uuid': self.uuid, 'username': self.username, 'password': self.password,
                'is_admin': self.is_admin, 'records_id_list': self.records_id_list}
