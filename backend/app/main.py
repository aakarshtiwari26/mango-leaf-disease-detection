from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import close_database, get_client
from app.routers import history, predict


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_client()
    yield
    await close_database()


app = FastAPI(title="Mango Leaf Disease Detection API", version="1.0.0", lifespan=lifespan)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, tags=["predict"])
app.include_router(history.router, tags=["history"])


@app.get("/health", tags=["health"])
async def health() -> dict:
    return {"status": "ok"}
