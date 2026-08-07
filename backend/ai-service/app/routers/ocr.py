from pathlib import Path

from fastapi import APIRouter, Depends

from app.schemas import ApiResponse, OcrRequest, OcrResult
from app.security import Principal, current_principal
from app.services import ocr

router = APIRouter(prefix="/api/v1/ocr", tags=["OCR"])

UPLOAD_DIR = Path("../api-gateway/uploads").resolve()


@router.post("/extract", response_model=ApiResponse[OcrResult])
def extract(request: OcrRequest, principal: Principal = Depends(current_principal)):
    tenant_dir = UPLOAD_DIR / principal.tenant_id
    result = ocr.extract(request.file_id, request.document_type, tenant_dir)
    return ApiResponse(data=result)
