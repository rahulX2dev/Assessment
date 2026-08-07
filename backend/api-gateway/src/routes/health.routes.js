import { Router } from 'express'
import { config } from '../config/index.js'
import { ok, asyncRoute } from '../utils/respond.js'
import { breakerStates } from '../services/serviceClient.js'
import { hubSnapshot } from '../websocket/hub.js'

const router = Router()
const startedAt = Date.now()

router.get('/health', (req, res) =>
  ok(res, {
    status: 'up',
    service: 'api-gateway',
    version: '1.0.0',
    env: config.env,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
  }),
)

router.get(
  '/health/ready',
  asyncRoute(async (req, res) => {
    const checks = await Promise.all(
      Object.entries(config.services).map(async ([name, baseUrl]) => {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 2500)

        try {
          const response = await fetch(new URL('/health', baseUrl), { signal: controller.signal })
          return { name, baseUrl, reachable: response.ok, status: response.status }
        } catch (error) {
          return { name, baseUrl, reachable: false, error: error.message }
        } finally {
          clearTimeout(timer)
        }
      }),
    )

    const degraded = checks.some((check) => !check.reachable)

    return res.status(degraded ? 503 : 200).json({
      success: !degraded,
      data: {
        status: degraded ? 'degraded' : 'ready',
        upstreams: checks,
        circuits: breakerStates(),
        websocket: hubSnapshot(),
      },
    })
  }),
)

export default router
