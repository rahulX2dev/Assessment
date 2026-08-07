import { Router } from 'express'
import { ApiError } from '../utils/ApiError.js'
import { accepted, asyncRoute, ok } from '../utils/respond.js'
import { authenticate, requireInternalToken, requireRoles } from '../middleware/auth.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { broadcast, hubSnapshot } from '../websocket/hub.js'

const router = Router()

router.post(
  '/dispatch',
  requireInternalToken,
  asyncRoute(async (req, res) => {
    const { tenantId, channel, event, payload } = req.body || {}

    if (!event) throw ApiError.badRequest('event is required')

    const delivered = broadcast({ tenantId, channel: channel || 'notifications', event, payload })

    return accepted(res, { delivered, event, channel: channel || 'notifications' })
  }),
)

router.post(
  '/broadcast',
  authenticate,
  requireRoles('ADMIN', 'OWNER'),
  rateLimit({ scope: 'notify', max: 30, windowMs: 60_000 }),
  asyncRoute(async (req, res) => {
    const { title, body, channel } = req.body || {}

    if (!title) throw ApiError.badRequest('title is required')

    const delivered = broadcast({
      tenantId: req.auth.tenantId,
      channel: channel || 'notifications',
      event: 'notification.received',
      payload: { title, body, sentBy: req.auth.userId },
    })

    return accepted(res, { delivered })
  }),
)

router.get(
  '/connections',
  authenticate,
  requireRoles('ADMIN', 'OWNER'),
  asyncRoute(async (req, res) => ok(res, hubSnapshot())),
)

export default router
