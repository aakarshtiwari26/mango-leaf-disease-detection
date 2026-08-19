from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PredictionOut(BaseModel):
    id: str
    image_url: str
    prediction: str
    confidence: float
    created_at: datetime
    ip_address: Optional[str] = None
    device: Optional[str] = None
    location: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None


class PredictResponse(BaseModel):
    status: str
    prediction: Optional[str] = None
    confidence: Optional[float] = None
    image_url: Optional[str] = None
    message: Optional[str] = None


class HistoryResponse(BaseModel):
    items: list[PredictionOut]
    total: int
    page: int
    page_size: int
