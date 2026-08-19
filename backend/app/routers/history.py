from fastapi import APIRouter, HTTPException, Query, status

from app.database import get_database
from app.models.prediction import HistoryResponse, PredictionOut

router = APIRouter()


@router.get("/history", response_model=HistoryResponse)
async def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
) -> HistoryResponse:
    try:
        db = get_database()
        skip = (page - 1) * page_size

        cursor = db.predictions.find().sort("created_at", -1).skip(skip).limit(page_size)
        documents = [doc async for doc in cursor]
        total = await db.predictions.count_documents({})
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not load prediction history.",
        ) from exc

    items = [
        PredictionOut(
            id=str(doc["_id"]),
            image_url=doc["image_url"],
            prediction=doc["prediction"],
            confidence=doc["confidence"],
            created_at=doc["created_at"],
            ip_address=doc.get("ip_address"),
            device=doc.get("device"),
        )
        for doc in documents
    ]

    return HistoryResponse(items=items, total=total, page=page, page_size=page_size)
