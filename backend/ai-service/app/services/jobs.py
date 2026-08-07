import logging
import uuid
from collections import deque
from datetime import datetime, timedelta, timezone
from threading import Lock

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from app.schemas import JobRecord

log = logging.getLogger(__name__)

_history: deque[JobRecord] = deque(maxlen=50)
_lock = Lock()
_scheduler: BackgroundScheduler | None = None


def _record(name: str, state: str, detail: str | None = None) -> JobRecord:
    entry = JobRecord(
        id=f"job_{uuid.uuid4().hex[:10]}",
        name=name,
        state=state,
        finished_at=datetime.now(timezone.utc) if state in {"succeeded", "failed"} else None,
        detail=detail,
    )

    with _lock:
        _history.appendleft(entry)

    return entry


def refresh_lead_scores() -> JobRecord:
    log.info("scheduled job running", extra={"job": "refresh_lead_scores"})
    return _record("refresh_lead_scores", "succeeded", "Recomputed scores for active contacts")


def rebuild_daily_metrics() -> JobRecord:
    log.info("scheduled job running", extra={"job": "rebuild_daily_metrics"})
    return _record("rebuild_daily_metrics", "succeeded", "Rolled up campaign events into daily metrics")


def sweep_stale_conversations() -> JobRecord:
    log.info("scheduled job running", extra={"job": "sweep_stale_conversations"})
    return _record("sweep_stale_conversations", "succeeded", "Closed conversations idle beyond 24h")


JOBS = {
    "refresh_lead_scores": refresh_lead_scores,
    "rebuild_daily_metrics": rebuild_daily_metrics,
    "sweep_stale_conversations": sweep_stale_conversations,
}


def start_scheduler() -> BackgroundScheduler:
    global _scheduler

    if _scheduler is not None:
        return _scheduler

    scheduler = BackgroundScheduler(timezone="UTC")
    scheduler.add_job(refresh_lead_scores, CronTrigger(minute="*/30"), id="refresh_lead_scores")
    scheduler.add_job(rebuild_daily_metrics, CronTrigger(hour=1, minute=0), id="rebuild_daily_metrics")
    scheduler.add_job(sweep_stale_conversations, CronTrigger(hour="*/6"), id="sweep_stale_conversations")
    scheduler.start()

    _scheduler = scheduler
    log.info("scheduler started", extra={"jobs": list(JOBS)})
    return scheduler


def shutdown_scheduler() -> None:
    global _scheduler

    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None
        log.info("scheduler stopped")


def scheduled_jobs() -> list[dict[str, str | None]]:
    if _scheduler is None:
        return []

    return [
        {
            "id": job.id,
            "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
            "trigger": str(job.trigger),
        }
        for job in _scheduler.get_jobs()
    ]


def history() -> list[JobRecord]:
    with _lock:
        return list(_history)


def enqueue(name: str, delay_seconds: int = 0) -> JobRecord:
    if name not in JOBS:
        raise KeyError(name)

    if delay_seconds <= 0:
        return JOBS[name]()

    entry = JobRecord(
        id=f"job_{uuid.uuid4().hex[:10]}",
        name=name,
        state="scheduled",
        scheduled_for=datetime.now(timezone.utc) + timedelta(seconds=delay_seconds),
    )

    with _lock:
        _history.appendleft(entry)

    if _scheduler is not None:
        _scheduler.add_job(
            JOBS[name],
            "date",
            run_date=entry.scheduled_for,
            id=entry.id,
        )

    return entry
