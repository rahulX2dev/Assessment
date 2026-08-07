import { Router } from 'express'
import { asyncRoute } from '../utils/respond.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { callService } from '../services/serviceClient.js'
import { broadcast } from '../websocket/hub.js'
import { logger } from '../utils/logger.js'

const router = Router()

router.get(
  '/whatsapp',
  rateLimit({ scope: 'webhook', max: 60, windowMs: 60_000 }),
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/webhooks/whatsapp', {
      query: {
        'hub.mode': req.query['hub.mode'],
        'hub.verify_token': req.query['hub.verify_token'],
        'hub.challenge': req.query['hub.challenge'],
      },
      req,
    })

    return res.status(status).send(payload)
  }),
)

router.post(
  '/whatsapp',
  rateLimit({ scope: 'webhook', max: 600, windowMs: 60_000 }),
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/webhooks/whatsapp', {
      method: 'POST',
      body: req.body,
      req,
    })

    const processed = payload?.data?.processed ?? 0
    if (processed > 0) {
      logger.info('delivery receipts forwarded', { requestId: req.id, processed })
      broadcast({ channel: 'campaigns', event: 'message.status', payload: { processed } })
    }

    return res.status(status).json(payload)
  }),
)

export default router
