export class ApiError extends Error {
  constructor(status, code, message, details = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  static badRequest(message, details) {
    return new ApiError(400, 'BAD_REQUEST', message, details)
  }

  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, 'UNAUTHORIZED', message)
  }

  static forbidden(message = 'You do not have access to this resource') {
    return new ApiError(403, 'FORBIDDEN', message)
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, 'NOT_FOUND', message)
  }

  static tooManyRequests(message, details) {
    return new ApiError(429, 'RATE_LIMITED', message, details)
  }

  static badGateway(message, details) {
    return new ApiError(502, 'UPSTREAM_ERROR', message, details)
  }

  static unavailable(message, details) {
    return new ApiError(503, 'SERVICE_UNAVAILABLE', message, details)
  }
}
