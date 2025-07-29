import mysql.connector
from contextlib import contextmanager

@contextmanager
def get_db_connection():
    conn = None
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="datahashed@1",
            database="loginapp"
        )
        yield conn
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()
