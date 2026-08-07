import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config/index.js'
import routes from './routes/index.js'
import { requestContext } from './middleware/requestContext.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { ApiError } from './utils/ApiError.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.set('trust proxy', 1)

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.corsOrigins.includes(origin)) return callback(null, true)
        return callback(ApiError.forbidden(`Origin ${origin} is not allowed`))
      },
      credentials: true,
      exposedHeaders: ['x-request-id', 'RateLimit-Remaining', 'RateLimit-Reset'],
    }),
  )

  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true, limit: '1mb' }))
  app.use(requestContext)

  app.use('/api', routes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
