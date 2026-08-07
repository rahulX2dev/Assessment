import { randomUUID } from 'node:crypto'
import { logger } from '../utils/logger.js'

export function requestContext(req, res, next) {
  req.id = req.get('x-request-id') || randomUUID()
  req.startedAt = process.hrtime.bigint()
  res.set('x-request-id', req.id)

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - req.startedAt) / 1e6

    logger.info('request completed', {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      tenantId: req.auth?.tenantId,
    })
  })

  next()
}
