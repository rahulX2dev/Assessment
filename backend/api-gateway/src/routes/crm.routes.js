import { Router } from 'express'
import { asyncRoute } from '../utils/respond.js'
import { authenticate, requireRoles } from '../middleware/auth.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { callService } from '../services/serviceClient.js'

const router = Router()

router.use(authenticate, rateLimit({ scope: 'crm' }))

router.get(
  '/contacts',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/crm/contacts', {
      query: {
        page: req.query.page,
        size: req.query.size,
        search: req.query.search,
        stage: req.query.stage,
        ownerId: req.query.ownerId,
      },
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/contacts',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/crm/contacts', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.get(
  '/contacts/:id',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', `/api/v1/crm/contacts/${req.params.id}`, { req })
    return res.status(status).json(payload)
  }),
)

router.put(
  '/contacts/:id',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', `/api/v1/crm/contacts/${req.params.id}`, {
      method: 'PUT',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.delete(
  '/contacts/:id',
  requireRoles('ADMIN', 'OWNER'),
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', `/api/v1/crm/contacts/${req.params.id}`, {
      method: 'DELETE',
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.get(
  '/deals',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/crm/deals', {
      query: { page: req.query.page, size: req.query.size, stage: req.query.stage },
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.post(
  '/deals',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', '/api/v1/crm/deals', {
      method: 'POST',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

router.patch(
  '/deals/:id/stage',
  asyncRoute(async (req, res) => {
    const { status, payload } = await callService('core', `/api/v1/crm/deals/${req.params.id}/stage`, {
      method: 'PATCH',
      body: req.body,
      req,
    })

    return res.status(status).json(payload)
  }),
)

export default router
