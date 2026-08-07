import 'dotenv/config'
import path from 'node:path'

function required(key, fallback) {
  const value = process.env[key] ?? fallback
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function toNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 8080),
  isProduction: process.env.NODE_ENV === 'production',

  jwt: {
    secret: required('JWT_SECRET', 'development-only-secret-change-me-32-chars'),
    issuer: process.env.JWT_ISSUER || 'hubflow-core',
  },

  internalToken: process.env.INTERNAL_SERVICE_TOKEN || 'internal-dev-token',

  services: {
    core: process.env.CORE_SERVICE_URL || 'http://localhost:8081',
    ai: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  },

  redisUrl: process.env.REDIS_URL || '',

  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  rateLimit: {
    windowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
    max: toNumber(process.env.RATE_LIMIT_MAX, 120),
    authMax: toNumber(process.env.RATE_LIMIT_AUTH_MAX, 10),
  },

  upload: {
    dir: path.resolve(process.env.UPLOAD_DIR || './uploads'),
    maxBytes: toNumber(process.env.UPLOAD_MAX_BYTES, 10 * 1024 * 1024),
    allowedMime: ['text/csv', 'application/vnd.ms-excel', 'text/plain', 'application/csv'],
  },
}
