import { config } from '../config/index.js'
import { ApiError } from '../utils/ApiError.js'
import { getRateLimitStore } from '../services/rateLimitStore.js'

function defaultKey(req) {
  if (req.auth?.tenantId) return `tenant:${req.auth.tenantId}:${req.auth.userId}`
  const forwarded = req.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip
  return `ip:${ip}`
}

export function rateLimit({ windowMs = config.rateLimit.windowMs, max = config.rateLimit.max, scope = 'global', keyBuilder = defaultKey } = {}) {
  return async function rateLimitMiddleware(req, res, next) {
    try {
      const store = await getRateLimitStore()
      const key = `ratelimit:${scope}:${keyBuilder(req)}`
      const { count, resetAt } = await store.hit(key, windowMs)
      const remaining = Math.max(0, max - count)
      const resetSeconds = Math.max(0, Math.ceil((resetAt - Date.now()) / 1000))

      res.set('RateLimit-Limit', String(max))
      res.set('RateLimit-Remaining', String(remaining))
      res.set('RateLimit-Reset', String(resetSeconds))

      if (count > max) {
        res.set('Retry-After', String(resetSeconds))
        return next(
          ApiError.tooManyRequests('Rate limit exceeded for this window', {
            limit: max,
            windowMs,
            retryAfterSeconds: resetSeconds,
          }),
        )
      }

      return next()
    } catch (error) {
      return next(error)
    }
  }
}
