import { config } from '../config/index.js'
import { ApiError } from '../utils/ApiError.js'
import { logger } from '../utils/logger.js'
import { CircuitBreaker } from './circuitBreaker.js'

const breakers = {
  core: new CircuitBreaker('core-service'),
  ai: new CircuitBreaker('ai-service'),
}

const RETRYABLE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function execute(service, path, { method = 'GET', body, query, req, timeoutMs = 8000 }) {
  const baseUrl = config.services[service]
  if (!baseUrl) throw ApiError.badGateway(`Unknown upstream service: ${service}`)

  const url = new URL(path.replace(/^\//, ''), baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'x-internal-token': config.internalToken,
        'x-request-id': req?.id || '',
        ...(req?.auth?.tenantId ? { 'x-tenant-id': req.auth.tenantId } : {}),
        ...(req?.auth?.userId ? { 'x-user-id': req.auth.userId } : {}),
        ...(req?.auth?.raw ? { authorization: `Bearer ${req.auth.raw}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    const raw = await response.text()
    const contentType = response.headers.get('content-type') || ''

    let payload = raw
    if (raw && contentType.includes('json')) {
      try {
        payload = JSON.parse(raw)
      } catch (error) {
        payload = raw
      }
    }

    if (response.status >= 500) {
      throw ApiError.badGateway(`Upstream ${service} returned ${response.status}`, { payload })
    }

    return { status: response.status, payload }
  } finally {
    clearTimeout(timer)
  }
}

export async function callService(service, path, options = {}) {
  const breaker = breakers[service]

  if (breaker && !breaker.canAttempt()) {
    throw ApiError.unavailable(`${service} is temporarily unavailable`, breaker.snapshot())
  }

  const attempts = RETRYABLE_METHODS.has(options.method || 'GET') ? 3 : 1
  let lastError

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const result = await execute(service, path, options)
      breaker?.recordSuccess()
      return result
    } catch (error) {
      lastError = error

      const aborted = error.name === 'AbortError'
      logger.warn('upstream call failed', {
        upstream: service,
        path,
        attempt,
        error: aborted ? 'timeout' : error.message,
      })

      if (attempt < attempts) {
        await delay(120 * 2 ** (attempt - 1))
      }
    }
  }

  breaker?.recordFailure()

  if (lastError instanceof ApiError) throw lastError
  throw ApiError.badGateway(`Could not reach ${service}`, { reason: lastError?.message })
}

export function breakerStates() {
  return Object.values(breakers).map((breaker) => breaker.snapshot())
}
