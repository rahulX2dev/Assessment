import logging
import time
from contextlib import contextmanager
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings

log = logging.getLogger(__name__)

CONNECT_TIMEOUT_SECONDS = 2
CIRCUIT_COOLDOWN_SECONDS = 30

_engine: Engine | None = None
_session_factory: sessionmaker[Session] | None = None
_unavailable_until: float = 0.0


def get_engine() -> Engine:
    global _engine, _session_factory

    if _engine is None:
        settings = get_settings()
        _engine = create_engine(
            settings.postgres_dsn,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            pool_recycle=1800,
            future=True,
            connect_args={"connect_timeout": CONNECT_TIMEOUT_SECONDS},
        )
        _session_factory = sessionmaker(bind=_engine, expire_on_commit=False)

    return _engine


def _circuit_open() -> bool:
    return time.monotonic() < _unavailable_until


def _trip_circuit() -> None:
    global _unavailable_until
    _unavailable_until = time.monotonic() + CIRCUIT_COOLDOWN_SECONDS


@contextmanager
def session_scope() -> Iterator[Session]:
    global _unavailable_until

    if _circuit_open():
        raise RuntimeError("Postgres marked unavailable, retrying after cooldown")

    get_engine()

    if _session_factory is None:
        raise RuntimeError("Session factory was not initialised")

    session = _session_factory()
    try:
        yield session
        session.commit()
        _unavailable_until = 0.0
    except Exception:
        session.rollback()
        _trip_circuit()
        raise
    finally:
        session.close()


def healthcheck() -> bool:
    from sqlalchemy import text

    try:
        with get_engine().connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        log.warning("postgres healthcheck failed", extra={"reason": str(exc)})
        return False
