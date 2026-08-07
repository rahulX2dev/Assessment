import { Router } from 'express'
import { ApiError } from '../utils/ApiError.js'
import { accepted, asyncRoute } from '../utils/respond.js'
import { authenticate, requireRoles } from '../middleware/auth.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { callService } from '../services/serviceClient.js'
import { broadcast } from '../websocket/hub.js'

const router = Router()

router.use(authenticate, rateLimit({ scope: 'campaigns' }))

router.get(
  '/templates',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/campaigns/templates', { req })
    return res.status(status).json(payload)
  }),
)

router.post(
  '/templates',
  requireRoles('ADMIN', 'OWNER', 'MARKETER'),
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/campaigns/templates', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.patch(
  '/templates/:id/approval',
  requireRoles('ADMIN', 'OWNER'),
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService(
      'core',
      `/api/v1/campaigns/templates/${req.params.id}/approval`,
      { method: 'PATCH', query: { status: req.query.status }, req },
    )

    return res.status(status).json(payload)
  }),
)

router.post(
  '/webhooks/delivery',
  asyncRoute(async (req, res) => {
    const { campaignId, messageId, state, tenantId } = req.body || {}

    if (!campaignId || !state) {
      throw ApiError.badRequest('campaignId and state are required')
    }

    const delivered = broadcast({
      tenantId: tenantId || req.auth.tenantId,
      channel: 'campaigns',
      event: 'message.status',
      payload: { campaignId, messageId, state },
    })

    return accepted(res, { forwardedToClients: delivered })
  }),
)

router.get(
  '/',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/campaigns', {
      query: { page: req.query.page, size: req.query.size, status: req.query.status },
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/',
  requireRoles('ADMIN', 'OWNER', 'MARKETER'),
  asyncRoute(async (req, res) => {
    const { name, templateId } = req.body || {}

    if (!name || !templateId) {
      throw ApiError.badRequest('name and templateId are required', {
        missing: [!name && 'name', !templateId && 'templateId'].filter(Boolean),
      })
    }

    const { status, payload } = await callService('core', '/api/v1/campaigns', {
      method: 'POST',
      body: req.body,
      req,
    })

    broadcast({
      tenantId: req.auth.tenantId,
      channel: 'campaigns',
      event: 'campaign.created',
      payload: { name, createdBy: req.auth.userId },
    })

    return res.status(status).json(payload)
  }),
)

router.get(
  '/:id',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', `/api/v1/campaigns/${req.params.id}`, { req })
    return res.status(status).json(payload)
  }),
)

router.post(
  '/:id/dispatch',
  requireRoles('ADMIN', 'OWNER', 'MARKETER'),
  rateLimit({ scope: 'campaign-dispatch', max: 10, windowMs: 60_000 }),
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', `/api/v1/campaigns/${req.params.id}/dispatch`, {
      method: 'POST',
      body: req.body,
      req,
    })

    broadcast({
      tenantId: req.auth.tenantId,
      channel: 'campaigns',
      event: 'campaign.queued',
      payload: { campaignId: req.params.id, queuedBy: req.auth.userId },
    })

    return res.status(status).json(payload)
  }),
)

router.get(
  '/:id/stats',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', `/api/v1/campaigns/${req.params.id}/stats`, {
      req,
    })

    return res.status(status).json(payload)
  }),
)

export default router
