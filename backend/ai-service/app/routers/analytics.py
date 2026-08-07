from fastapi import APIRouter, Depends, Query

from app.schemas import ApiResponse, DashboardAnalytics
from app.security import Principal, current_principal
from app.services import analytics

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=ApiResponse[DashboardAnalytics])
def dashboard(
    window_days: int = Query(default=14, ge=1, le=90),
    principal: Principal = Depends(current_principal),
):
    return ApiResponse(data=analytics.dashboard(principal.tenant_id, window_days))
