import uuid
from datetime import datetime, timezone

from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile, status

from app.database import get_database
from app.models.prediction import PredictResponse
from app.services import device_info, geolocation, imagekit_service, inference

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024
MAX_CLIENT_FIELD_LENGTH = 64


@router.post("/predict", response_model=PredictResponse)
async def predict(
    request: Request,
    file: UploadFile = File(...),
    client_language: Optional[str] = Form(None),
    client_timezone: Optional[str] = Form(None),
) -> PredictResponse:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type. Upload a JPEG, PNG, or WebP image.",
        )

    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large. Maximum size is 8 MB.",
        )
    if not image_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file upload.")

    try:
        result = inference.predict(image_bytes)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction model is temporarily unavailable. Please try again shortly.",
        ) from exc

    if result.status == "rejected":
        return PredictResponse(status="rejected", message=result.message)

    try:
        file_name = f"{uuid.uuid4().hex}_{file.filename}"
        image_url = imagekit_service.upload_image(image_bytes, file_name)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Image upload failed. Please try again.",
        ) from exc

    ip_address = device_info.get_client_ip(request)
    device = device_info.parse_device(request.headers.get("user-agent", ""))
    location = await geolocation.lookup_location(ip_address)

    try:
        db = get_database()
        await db.predictions.insert_one(
            {
                "image_url": image_url,
                "prediction": result.prediction,
                "confidence": result.confidence,
                "created_at": datetime.now(timezone.utc),
                "ip_address": ip_address,
                "device": device,
                "location": location,
                "language": (client_language or "")[:MAX_CLIENT_FIELD_LENGTH] or None,
                "timezone": (client_timezone or "")[:MAX_CLIENT_FIELD_LENGTH] or None,
            }
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Prediction succeeded but saving history failed.",
        ) from exc

    return PredictResponse(
        status="ok",
        prediction=result.prediction,
        confidence=result.confidence,
        image_url=image_url,
    )
