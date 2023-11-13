import psycopg2
from json import dumps
from fastapi import HTTPException

from base_connect import get_conn, sql_search


class RecordsRepository:
    def __init__(self):
        self.conn = get_conn()
        self.cur = self.conn.cursor()

    def __del__(self):
        self.cur.connection.close()

    def get_records(self):
        try:
            return sql_search(self.cur, self.conn, 'SELECT * FROM records')
        except psycopg2.OperationalError:
            raise HTTPException(status_code=503, detail="No connection to DB")
        except Exception:
            raise HTTPException(status_code=404, detail="Not found")

    def delete_record(self, uuid: str):
        try:
            sql_search(
                self.cur, self.conn, 'SELECT * FROM records WHERE uuid = (%s)', (uuid,))
            self.cur.execute('DELETE FROM records WHERE uuid = (%s)', (uuid,))
        except Exception:
            raise HTTPException(status_code=404, detail="Not found")
        except psycopg2.OperationalError:
            raise HTTPException(status_code=503, detail="No connection to DB")
        self.conn.commit()
        return

    def update_record(self, updated_dict: dict):
        try:
            self.cur.execute(
                'UPDATE records set quadrilateral_barcode=%s, barcode_score=%s, quadrilateral_logo=%s, logo_score=%s, approved=%s, user_id=%s WHERE uuid =(%s)',
                (dumps(updated_dict['quadrilateral_barcode']), updated_dict['barcode_score'],
                 dumps(updated_dict['quadrilateral_logo']), updated_dict['logo_score'], updated_dict['approved'], updated_dict["user_id"], updated_dict['uuid'],))
        except psycopg2.OperationalError:
            raise HTTPException(status_code=503, detail="No connection to DB")
        except Exception:
            raise HTTPException(status_code=404, detail="Not found")
        self.conn.commit()

    def find_record(self, uuid: str):
        try:
            return sql_search(self.cur, self.conn, 'SELECT * FROM records WHERE uuid =(%s)', (uuid,), one=True)
        except psycopg2.OperationalError:
            raise HTTPException(status_code=503, detail="No connection to DB")
        except Exception as ex:
            raise HTTPException(status_code=404, detail="Not found")

    def add_record(self, uuid: str, quadrilateral_barcode: dict, barcode_score: float, quadrilateral_logo: dict, logo_score: float, approved: bool, user_id: str):
        try:
            self.cur.execute(
                "INSERT INTO records (uuid, quadrilateral_barcode, barcode_score, quadrilateral_logo, logo_score, approved, user_id) VALUES (%s, %s, %s, %s, %s, %s, %s);",
                (uuid, dumps(quadrilateral_barcode), barcode_score, dumps(quadrilateral_logo), logo_score, approved, user_id,))
        except psycopg2.OperationalError:
            raise HTTPException(status_code=503, detail="No connection to DB")
        except Exception:
            raise HTTPException(status_code=404, detail="Not found")
        self.conn.commit()
