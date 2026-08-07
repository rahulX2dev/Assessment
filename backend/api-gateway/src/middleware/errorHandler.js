import { config } from '../config/index.js'
import { ApiError } from '../utils/ApiError.js'
import { logger } from '../utils/logger.js'

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`No route matches ${req.method} ${req.originalUrl}`))
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  const isKnown = error instanceof ApiError
  const status = isKnown ? error.status : 500
  const code = isKnown ? error.code : 'INTERNAL_ERROR'
  const message = isKnown ? error.message : 'An unexpected error occurred'

  if (status >= 500) {
    logger.error('unhandled request failure', {
      requestId: req.id,
      path: req.originalUrl,
      error: error.message,
      stack: config.isProduction ? undefined : error.stack,
    })
  }

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      details: isKnown ? error.details : undefined,
      requestId: req.id,
    },
  })
}
