from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    port: int = 8000

    jwt_secret: str = "change-me-in-production-min-32-chars-long"
    jwt_issuer: str = "hubflow-core"
    internal_service_token: str = "shared-secret-between-internal-services"

    postgres_dsn: str = "postgresql+psycopg://hubflow:hubflow@localhost:5432/hubflow_analytics"
    redis_url: str = "redis://localhost:6379/1"

    core_service_url: str = "http://localhost:8081"
    cors_origins: str = "http://localhost:5173,http://localhost:8080"

    scheduler_enabled: bool = True
    log_level: str = "INFO"

    @property
    def origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
