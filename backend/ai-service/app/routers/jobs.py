from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas import ApiResponse, JobRecord
from app.security import Principal, current_principal, require_internal_token
from app.services import jobs

router = APIRouter(prefix="/api/v1/jobs", tags=["Background jobs"])


@router.get("", response_model=ApiResponse[list[JobRecord]])
def history(principal: Principal = Depends(current_principal)):
    return ApiResponse(data=jobs.history(), meta={"scheduled": jobs.scheduled_jobs()})


@router.post("/{name}/run", response_model=ApiResponse[JobRecord])
def run(
    name: str,
    delay_seconds: int = 0,
    _: None = Depends(require_internal_token),
):
    try:
        record = jobs.enqueue(name, delay_seconds)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unknown job '{name}'. Available: {', '.join(jobs.JOBS)}",
        ) from exc

    return ApiResponse(data=record)
