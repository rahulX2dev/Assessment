import logging
import time
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import get_settings
from app.database import healthcheck
from app.logging_setup import configure_logging
from app.routers import analytics, assistant, jobs, ocr
from app.services import jobs as job_service

settings = get_settings()
configure_logging(settings.log_level)
log = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.scheduler_enabled:
        job_service.start_scheduler()
    log.info("ai service ready", extra={"env": settings.app_env})
    yield
    job_service.shutdown_scheduler()


app = FastAPI(
    title="Hubflow AI Service",
    version="1.0.0",
    description=(
        "AI assistant, intent classification, lead scoring, recommendations, dashboard "
        "analytics, OCR extraction and scheduled background jobs for Hubflow Automation."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["x-request-id"],
)


@app.middleware("http")
async def request_context(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    started = time.perf_counter()

    response = await call_next(request)
    duration_ms = round((time.perf_counter() - started) * 1000, 2)

    response.headers["x-request-id"] = request_id
    log.info(
        "request completed",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "duration_ms": duration_ms,
        },
    )

    return response


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    codes = {400: "BAD_REQUEST", 401: "UNAUTHORIZED", 403: "FORBIDDEN", 404: "NOT_FOUND", 429: "RATE_LIMITED"}

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": codes.get(exc.status_code, "HTTP_ERROR"),
                "message": exc.detail,
                "path": request.url.path,
            },
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    details = {
        ".".join(str(part) for part in error["loc"][1:]): error["msg"]
        for error in exc.errors()
    }

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_FAILED",
                "message": "One or more fields failed validation",
                "details": details,
                "path": request.url.path,
            },
        },
    )


@app.exception_handler(Exception)
async def unhandled_handler(request: Request, exc: Exception):
    log.exception("unhandled error", extra={"path": request.url.path})

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred. The incident has been logged.",
                "path": request.url.path,
            },
        },
    )


@app.get("/health", tags=["Health"])
def health():
    return {
        "success": True,
        "data": {"status": "up", "service": "ai-service", "version": "1.0.0"},
    }


@app.get("/health/ready", tags=["Health"])
def ready():
    postgres_up = healthcheck()

    return JSONResponse(
        status_code=200 if postgres_up else 503,
        content={
            "success": postgres_up,
            "data": {
                "status": "ready" if postgres_up else "degraded",
                "postgres": postgres_up,
                "scheduler": job_service.scheduled_jobs(),
            },
        },
    )


app.include_router(assistant.router)
app.include_router(analytics.router)
app.include_router(ocr.router)
app.include_router(jobs.router)
