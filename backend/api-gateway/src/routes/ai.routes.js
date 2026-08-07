import { Router } from 'express'
import { ApiError } from '../utils/ApiError.js'
import { asyncRoute } from '../utils/respond.js'
import { authenticate } from '../middleware/auth.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { callService } from '../services/serviceClient.js'

const router = Router()

router.use(authenticate, rateLimit({ scope: 'ai', max: 60, windowMs: 60_000 }))

router.post(
  '/chat',
  asyncRoute(async (req, res) => {
    if (!req.body?.message) throw ApiError.badRequest('message is required')

    const { status, payload } = await callService('ai', '/api/v1/assistant/chat', {
      method: 'POST',
      body: { ...req.body, tenantId: req.auth.tenantId },
      req,
      timeoutMs: 20_000,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/classify',
  asyncRoute(async (req, res) => {
    if (!req.body?.text) throw ApiError.badRequest('text is required')

    const { status, payload } = await callService('ai', '/api/v1/assistant/classify', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.get(
  '/recommendations/:contactId',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService(
      'ai',
      `/api/v1/recommendations/${req.params.contactId}`,
      { req },
    )

    return res.status(status).json(payload)
  }),
)

router.get(
  '/analytics/dashboard',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('ai', '/api/v1/analytics/dashboard', {
      query: { tenantId: req.auth.tenantId, from: req.query.from, to: req.query.to },
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/ocr',
  asyncRoute(async (req, res) => {
    if (!req.body?.fileId) throw ApiError.badRequest('fileId is required')

    const { status, payload } = await callService('ai', '/api/v1/ocr/extract', {
      method: 'POST',
      body: req.body,
      req,
      timeoutMs: 30_000,
    })

    return res.status(status).json(payload)
  }),
)

export default router
