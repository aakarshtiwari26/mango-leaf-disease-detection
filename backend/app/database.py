from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import get_settings

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    """Lazily create (and reuse) the Motor client / connection pool."""
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(get_settings().mongo_uri)
    return _client


def get_database() -> AsyncIOMotorDatabase:
    return get_client()[get_settings().mongo_db_name]


async def close_database() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
