import os
from os.path import join, dirname, exists
from dotenv import load_dotenv


dotenv_path = join(dirname(__file__), ".env")
if exists(dotenv_path):
    load_dotenv(dotenv_path)

DB_NAME = os.environ.get("POSTGRES_DB")
DB_USER = os.environ.get("POSTGRES_USER")
DB_PASSWORD = os.environ.get("POSTGRES_PASSWORD")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")

SECRET = os.environ.get("SECRET_KEY")
