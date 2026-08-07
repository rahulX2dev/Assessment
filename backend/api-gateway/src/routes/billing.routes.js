import { Router } from 'express'
import { asyncRoute, ok } from '../utils/respond.js'
import { authenticate } from '../middleware/auth.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { callService } from '../services/serviceClient.js'
import { planCatalogue } from '../data/planCatalogue.js'
import { logger } from '../utils/logger.js'

const router = Router()

router.get(
  '/plans',
  rateLimit({ scope: 'public', max: 240 }),
  asyncRoute(async (req, res) => {
    try {
      const { payload } = await callService('core', '/api/v1/billing/plans', { req, timeoutMs: 3000 })
      if (payload?.data?.length) return res.json(payload)
    } catch (error) {
      logger.warn('serving cached plan catalogue', { reason: error.message })
    }

    res.set('x-served-from', 'gateway-cache')
    return ok(res, planCatalogue, { source: 'gateway-cache' })
  }),
)

router.use(authenticate, rateLimit({ scope: 'billing' }))

router.get(
  '/subscription',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/billing/subscription', { req })
    return res.status(status).json(payload)
  }),
)

router.post(
  '/subscription',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/billing/subscription', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.get(
  '/invoices',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/billing/invoices', {
      query: { page: req.query.page, size: req.query.size },
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.get(
  '/invoices/:id',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', `/api/v1/billing/invoices/${req.params.id}`, {
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.get(
  '/usage',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/billing/usage', {
      query: { from: req.query.from, to: req.query.to },
      req,
    })

    return res.status(status).json(payload)
  }),
)

export default router
