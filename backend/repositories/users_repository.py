import psycopg2
from json import dumps
from fastapi import HTTPException

from base_connect import get_conn, sql_search


class UsersRepository:
    def __init__(self):
        self.conn = get_conn()
        self.cur = self.conn.cursor()

    def __del__(self):
        self.cur.connection.close()

    def get_users(self):
        try:
            return sql_search(self.cur, self.conn, 'SELECT  uuid, username FROM users')
        except psycopg2.OperationalError:
            raise HTTPException(status_code=503, detail="No connection to DB")
        except Exception:
            raise HTTPException(status_code=404, detail="Not found")

    def get_users_admin(self):
        try:
            return sql_search(self.cur, self.conn, 'SELECT uuid, username, is_admin, records_id_list  FROM users')
        except psycopg2.OperationalError:
            raise HTTPException(status_code=503, detail="No connection to DB")
        except Exception:
            raise HTTPException(status_code=404, detail="Not found")

    def get_users_auth(self, uuid: str):
        try:
            user = sql_search(self.cur, self.conn, 'SELECT uuid, username, is_admin, records_id_list FROM users WHERE uuid=(%s)',
                              (uuid,), one=True)
            other = sql_search(
                self.cur, self.conn, 'SELECT  uuid, username FROM users WHERE NOT uuid=(%s)', (uuid,))
            other.append(user)
            return other
        except psycopg2.OperationalError:
            raise HTTPException(status_code=503, detail="No connection to DB")
        except Exception:
            raise HTTPException(status_code=404, detail="Not found")

    def get_user_one(self, uuid: str):
        try:
            user = sql_search(self.cur, self.conn, 'SELECT uuid, username FROM users WHERE uuid=(%s)',
                              (uuid,), one=True)
        except psycopg2.OperationalError:
            raise HTTPException(status_code=503, detail="No connection to DB")
        except Exception:
            raise HTTPException(status_code=404, detail="Not found")

        return user

    def get_user_one_full(self, uuid: str):
        try:
            user = sql_search(self.cur, self.conn, 'SELECT uuid, username, is_admin, records_id_list FROM users WHERE uuid=(%s)',
                              (uuid,), one=True)
        except psycopg2.OperationalError:
            raise HTTPException(status_code=503, detail="No connection to DB")
        except Exception:
            raise HTTPException(status_code=404, detail="Not found")

        return user

    def get_user_by_username(self, username: str):
        try:
            return sql_search(self.cur, self.conn, 'SELECT * FROM users WHERE username=(%s)', (username,), one=True)
        except Exception:
            raise HTTPException(status_code=503, detail="No connection to DB")

    def add_user(self, uuid: str, username: str, password: str, is_admin: bool, records_id_list: list):
        try:
            self.cur.execute(
                "INSERT INTO users (uuid, username, password, is_admin, records_id_list) VALUES (%s, %s, %s, %s, %s);",
                (uuid, username, password, is_admin, dumps(records_id_list),))
            self.conn.commit()
        except Exception:
            raise HTTPException(status_code=503, detail="No connection to DB")

    def get_user(self, uuid: str):
        try:
            return sql_search(self.cur, self.conn, 'SELECT * FROM users WHERE uuid =(%s)', (uuid,), one=True)
        except Exception:
            raise HTTPException(status_code=503, detail="No connection to DB")

    def put_user(self, uuid: str, new_user: dict):
        try:
            user = self.get_user(uuid)
            if user:
                self.cur.execute(
                    'UPDATE users set uuid=%s, username=%s, password=%s, is_admin=%s, records_id_list=%s WHERE uuid =(%s)',
                    (new_user['uuid'], new_user['username'], new_user['password'], new_user['is_admin'],
                     dumps(new_user['records_id_list']), uuid,))
                self.conn.commit()
            else:
                raise HTTPException(status_code=400, detail="Bad request")
        except Exception:
            raise HTTPException(status_code=503, detail="No connection to DB")

    def delete_user(self, uuid):
        try:
            print(self.cur.mogrify("DELETE FROM users WHERE uuid=%s", (uuid,)))
            self.cur.execute(self.cur.mogrify("DELETE FROM users WHERE uuid=%s", (uuid,)))
            self.conn.commit()
        except Exception:
            raise HTTPException(status_code=503, detail="No connection to DB")
