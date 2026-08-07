import { Router } from 'express'
import { asyncRoute } from '../utils/respond.js'
import { authenticate } from '../middleware/auth.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { callService } from '../services/serviceClient.js'

const router = Router()

router.use(authenticate, rateLimit({ scope: 'reports', max: 60, windowMs: 60_000 }))

router.get(
  '/summary',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/reports/summary', { req })
    return res.status(status).json(payload)
  }),
)

export default router
