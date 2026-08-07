import { Router } from 'express'
import healthRoutes from './health.routes.js'
import authRoutes from './auth.routes.js'
import crmRoutes from './crm.routes.js'
import campaignRoutes from './campaign.routes.js'
import billingRoutes from './billing.routes.js'
import hrmsRoutes from './hrms.routes.js'
import reportRoutes from './reports.routes.js'
import aiRoutes from './ai.routes.js'
import uploadRoutes from './upload.routes.js'
import notificationRoutes from './notification.routes.js'
import webhookRoutes from './webhook.routes.js'

const router = Router()

router.use(healthRoutes)

router.use('/v1/auth', authRoutes)
router.use('/v1/crm', crmRoutes)
router.use('/v1/campaigns', campaignRoutes)
router.use('/v1/billing', billingRoutes)
router.use('/v1/hrms', hrmsRoutes)
router.use('/v1/reports', reportRoutes)
router.use('/v1/ai', aiRoutes)
router.use('/v1/uploads', uploadRoutes)
router.use('/v1/notifications', notificationRoutes)
router.use('/v1/webhooks', webhookRoutes)

export default router
