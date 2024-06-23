import os
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import SQLAlchemyError
from asyncpg import PostgresError
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Load environment variables
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", 5432)
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# SQLAlchemy base model
Base = declarative_base()

# Create the engine and sessionmaker
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

# Dependency to get the database session
async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Optional: DatabaseService class for more control
class DatabaseService:
    def __init__(self, db_url: str):
        self.__db_url = db_url
        self.__engine = create_async_engine(self.__db_url, echo=True)
        self.__async_session_factory = sessionmaker(
            self.__engine, expire_on_commit=False, class_=AsyncSession
        )

    async def connect(self):
        try:
            # Test connection
            async with self.__engine.connect() as conn:
                await conn.execute('SELECT 1')
        except (SQLAlchemyError, PostgresError) as e:
            logging.error(f"Database connection failed: {str(e)}")
            raise  # Re-throw the exception after logging

    async def disconnect(self):
        await self.__engine.dispose()
        logging.info("Disconnected from the database.")

    async def get_session(self) -> AsyncSession:
        async_session = self.__async_session_factory()
        try:
            yield async_session
            await async_session.commit()
        except Exception as e:
            await async_session.rollback()
            logging.error(f"Transaction failed and rolled back: {str(e)}")
            raise
        finally:
            await async_session.close()

database_service = DatabaseService(DATABASE_URL)

async def get_database_service():
    return database_service
