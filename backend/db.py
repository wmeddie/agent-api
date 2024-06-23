import asyncpg


async def get_db():
    from dotenv import load_dotenv
    load_dotenv()

    import os
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")
    database = os.getenv("DB_DATABASE")

    conn = await asyncpg.connect(f'postgresql://{user}:{password}@{host}:{port}/{database}')
    return conn
