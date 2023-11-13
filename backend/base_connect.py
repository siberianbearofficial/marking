from psycopg2 import *
from config import DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT


def get_conn():
    conn = connect(dbname=DB_NAME, user=DB_USER,
                   password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
    return conn


def sql_search(cur, conn, query, args=(), one=False):
    cur.execute(query, args)
    conn.commit()
    r = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
    return (r[0] if r else None) if one else r
