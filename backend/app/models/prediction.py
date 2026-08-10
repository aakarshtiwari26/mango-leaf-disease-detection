from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PredictionOut(BaseModel):
    id: str
    image_url: str
    prediction: str
    confidence: float
    created_at: datetime


class PredictResponse(BaseModel):
    status: str  # "ok" | "rejected"
    prediction: Optional[str] = None
    confidence: Optional[float] = None
    image_url: Optional[str] = None
    message: Optional[str] = None


class HistoryResponse(BaseModel):
    items: list[PredictionOut]
    total: int
    page: int
    page_size: int
