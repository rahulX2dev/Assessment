import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { ApiError } from '../utils/ApiError.js'

function extractToken(req) {
  const header = req.get('authorization')
  if (header && header.startsWith('Bearer ')) return header.slice(7).trim()
  if (req.query.access_token) return String(req.query.access_token)
  return null
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret, {
    issuer: config.jwt.issuer,
    algorithms: ['HS256'],
  })
}

export function authenticate(req, res, next) {
  const token = extractToken(req)

  if (!token) {
    return next(ApiError.unauthorized('Missing bearer token'))
  }

  try {
    const claims = verifyAccessToken(token)

    req.auth = {
      userId: claims.sub,
      tenantId: claims.tenantId,
      email: claims.email,
      roles: Array.isArray(claims.roles) ? claims.roles : [],
      raw: token,
    }

    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'TOKEN_EXPIRED', 'Access token has expired'))
    }
    return next(ApiError.unauthorized('Access token is invalid'))
  }
}

export function requireRoles(...allowed) {
  return (req, res, next) => {
    if (!req.auth) return next(ApiError.unauthorized())

    const granted = req.auth.roles.some((role) => allowed.includes(role))
    if (!granted) {
      return next(ApiError.forbidden(`Requires one of: ${allowed.join(', ')}`))
    }

    return next()
  }
}

export function requireInternalToken(req, res, next) {
  const provided = req.get('x-internal-token')

  if (!provided || provided !== config.internalToken) {
    return next(ApiError.forbidden('Invalid internal service token'))
  }

  return next()
}
