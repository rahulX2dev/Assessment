import { Router } from 'express'
import { config } from '../config/index.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncRoute, ok } from '../utils/respond.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { authenticate } from '../middleware/auth.js'
import { callService } from '../services/serviceClient.js'

const router = Router()

const authLimiter = rateLimit({
  scope: 'auth',
  max: config.rateLimit.authMax,
  windowMs: config.rateLimit.windowMs,
})

const otpLimiter = rateLimit({
  scope: 'otp',
  max: 5,
  windowMs: 15 * 60_000,
  keyBuilder: (req) => `phone:${req.body?.phone || req.ip}`,
})

function requireFields(body, fields) {
  const missing = fields.filter((field) => !body?.[field])
  if (missing.length) {
    throw ApiError.badRequest('Required fields are missing', { missing })
  }
}

router.post(
  '/register',
  authLimiter,
  asyncRoute(async (req, res) => {
    requireFields(req.body, ['fullName', 'email', 'phone', 'password', 'companyName'])

    const { status, payload } = await callService('core', '/api/v1/auth/register', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/login',
  authLimiter,
  asyncRoute(async (req, res) => {
    requireFields(req.body, ['email', 'password'])

    const { status, payload } = await callService('core', '/api/v1/auth/login', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/otp/send',
  otpLimiter,
  asyncRoute(async (req, res) => {
    requireFields(req.body, ['phone', 'purpose'])

    const { status, payload } = await callService('core', '/api/v1/auth/otp/send', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/otp/verify',
  otpLimiter,
  asyncRoute(async (req, res) => {
    requireFields(req.body, ['phone', 'code', 'purpose'])

    const { status, payload } = await callService('core', '/api/v1/auth/otp/verify', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/refresh',
  authLimiter,
  asyncRoute(async (req, res) => {
    requireFields(req.body, ['refreshToken'])

    const { status, payload } = await callService('core', '/api/v1/auth/refresh', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/logout',
  authenticate,
  asyncRoute(async (req, res) => {
    await callService('core', '/api/v1/auth/logout', { method: 'POST', body: req.body, req })
    return ok(res, { loggedOut: true })
  }),
)

router.get(
  '/me',
  authenticate,
  asyncRoute(async (req, res) => {
    const { payload } = await callService('core', '/api/v1/auth/me', { req })
    return res.json(payload)
  }),
)

export default router
