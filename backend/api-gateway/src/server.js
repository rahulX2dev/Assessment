import http from 'node:http'
import { createApp } from './app.js'
import { config } from './config/index.js'
import { attachWebSocket } from './websocket/hub.js'
import { logger } from './utils/logger.js'

const app = createApp()
const server = http.createServer(app)

attachWebSocket(server)

server.listen(config.port, () => {
  logger.info('api gateway listening', {
    port: config.port,
    env: config.env,
    upstreams: config.services,
  })
})

function shutdown(signal) {
  logger.info('shutdown signal received', { signal })

  server.close(() => {
    logger.info('http server closed')
    process.exit(0)
  })

  setTimeout(() => {
    logger.error('forced shutdown after timeout')
    process.exit(1)
  }, 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

process.on('unhandledRejection', (reason) => {
  logger.error('unhandled promise rejection', { reason: String(reason) })
})

process.on('uncaughtException', (error) => {
  logger.error('uncaught exception', { error: error.message, stack: error.stack })
  process.exit(1)
})
