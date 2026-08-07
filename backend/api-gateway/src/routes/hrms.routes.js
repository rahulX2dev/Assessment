import { Router } from 'express'
import { asyncRoute } from '../utils/respond.js'
import { authenticate, requireRoles } from '../middleware/auth.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { callService } from '../services/serviceClient.js'

const router = Router()

router.use(authenticate, rateLimit({ scope: 'hrms' }))

router.get(
  '/employees',
  requireRoles('ADMIN', 'OWNER'),
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/hrms/employees', {
      query: { page: req.query.page, size: req.query.size, department: req.query.department },
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/employees',
  requireRoles('ADMIN', 'OWNER'),
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/hrms/employees', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.get(
  '/employees/:id',
  requireRoles('ADMIN', 'OWNER'),
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', `/api/v1/hrms/employees/${req.params.id}`, {
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.get(
  '/leave',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/hrms/leave', {
      query: { page: req.query.page, size: req.query.size, status: req.query.status },
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/leave',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/hrms/leave', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.patch(
  '/leave/:id',
  requireRoles('ADMIN', 'OWNER'),
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', `/api/v1/hrms/leave/${req.params.id}`, {
      method: 'PATCH',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

export default router
