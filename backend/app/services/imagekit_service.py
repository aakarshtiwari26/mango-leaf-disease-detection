import base64
from functools import lru_cache

from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

from app.config import get_settings


@lru_cache
def _get_client() -> ImageKit:
    settings = get_settings()
    return ImageKit(
        public_key=settings.imagekit_public_key,
        private_key=settings.imagekit_private_key,
        url_endpoint=settings.imagekit_url_endpoint,
    )


def upload_image(image_bytes: bytes, file_name: str) -> str:
    client = _get_client()
    options = UploadFileRequestOptions(folder="/mango-leaf-predictions")
    result = client.upload_file(
        file=base64.b64encode(image_bytes),
        file_name=file_name,
        options=options,
    )
    return result.url
