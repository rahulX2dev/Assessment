import { WebSocketServer } from 'ws'
import { verifyAccessToken } from '../middleware/auth.js'
import { logger } from '../utils/logger.js'

const clients = new Set()
let server = null

function parseToken(request) {
  const url = new URL(request.url, 'http://localhost')
  const fromQuery = url.searchParams.get('token')
  if (fromQuery) return fromQuery

  const header = request.headers.authorization
  if (header && header.startsWith('Bearer ')) return header.slice(7)

  return null
}

function send(socket, type, payload) {
  if (socket.readyState !== socket.OPEN) return
  socket.send(JSON.stringify({ type, payload, ts: new Date().toISOString() }))
}

export function attachWebSocket(httpServer) {
  server = new WebSocketServer({ noServer: true })

  httpServer.on('upgrade', (request, socket, head) => {
    if (!request.url.startsWith('/ws')) {
      socket.destroy()
      return
    }

    const token = parseToken(request)

    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
      return
    }

    let claims
    try {
      claims = verifyAccessToken(token)
    } catch (error) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
      return
    }

    server.handleUpgrade(request, socket, head, (ws) => {
      ws.tenantId = claims.tenantId
      ws.userId = claims.sub
      ws.channels = new Set(['notifications'])
      ws.isAlive = true

      server.emit('connection', ws, request)
    })
  })

  server.on('connection', (socket) => {
    clients.add(socket)
    logger.info('websocket connected', { tenantId: socket.tenantId, clients: clients.size })

    send(socket, 'connection.ready', {
      tenantId: socket.tenantId,
      channels: [...socket.channels],
    })

    socket.on('pong', () => {
      socket.isAlive = true
    })

    socket.on('message', (raw) => {
      let message
      try {
        message = JSON.parse(raw.toString())
      } catch (error) {
        send(socket, 'error', { message: 'Payload must be valid JSON' })
        return
      }

      if (message.type === 'subscribe' && typeof message.channel === 'string') {
        socket.channels.add(message.channel)
        send(socket, 'subscribed', { channel: message.channel })
        return
      }

      if (message.type === 'unsubscribe' && typeof message.channel === 'string') {
        socket.channels.delete(message.channel)
        send(socket, 'unsubscribed', { channel: message.channel })
        return
      }

      if (message.type === 'ping') {
        send(socket, 'pong', {})
        return
      }

      send(socket, 'error', { message: `Unsupported message type: ${message.type}` })
    })

    socket.on('close', () => {
      clients.delete(socket)
      logger.info('websocket disconnected', { tenantId: socket.tenantId, clients: clients.size })
    })
  })

  const heartbeat = setInterval(() => {
    for (const socket of clients) {
      if (!socket.isAlive) {
        socket.terminate()
        clients.delete(socket)
        continue
      }
      socket.isAlive = false
      socket.ping()
    }
  }, 30_000)

  heartbeat.unref?.()

  return server
}

export function broadcast({ tenantId, channel = 'notifications', event, payload }) {
  let delivered = 0

  for (const socket of clients) {
    if (tenantId && socket.tenantId !== tenantId) continue
    if (!socket.channels.has(channel)) continue

    send(socket, event, payload)
    delivered += 1
  }

  return delivered
}

export function hubSnapshot() {
  const byTenant = {}
  for (const socket of clients) {
    byTenant[socket.tenantId] = (byTenant[socket.tenantId] || 0) + 1
  }

  return { connections: clients.size, byTenant }
}
