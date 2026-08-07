import { config } from '../config/index.js'
import { logger } from '../utils/logger.js'

class MemoryStore {
  constructor() {
    this.buckets = new Map()
    this.timer = setInterval(() => this.sweep(), 60_000)
    this.timer.unref?.()
  }

  sweep() {
    const now = Date.now()
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key)
    }
  }

  async hit(key, windowMs) {
    const now = Date.now()
    const existing = this.buckets.get(key)

    if (!existing || existing.resetAt <= now) {
      const bucket = { count: 1, resetAt: now + windowMs }
      this.buckets.set(key, bucket)
      return bucket
    }

    existing.count += 1
    return existing
  }
}

class RedisStore {
  constructor(client) {
    this.client = client
  }

  async hit(key, windowMs) {
    const seconds = Math.ceil(windowMs / 1000)
    const results = await this.client
      .multi()
      .incr(key)
      .ttl(key)
      .exec()

    const count = results[0][1]
    let ttl = results[1][1]

    if (ttl < 0) {
      await this.client.expire(key, seconds)
      ttl = seconds
    }

    return { count, resetAt: Date.now() + ttl * 1000 }
  }
}

let storePromise = null

async function build() {
  if (!config.redisUrl) {
    logger.warn('rate limiter using in-memory store', { reason: 'REDIS_URL not configured' })
    return new MemoryStore()
  }

  try {
    const { default: Redis } = await import('ioredis')
    const client = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
      enableOfflineQueue: false,
    })

    await client.connect()
    client.on('error', (error) => logger.error('redis error', { error: error.message }))

    logger.info('rate limiter using redis store')
    return new RedisStore(client)
  } catch (error) {
    logger.warn('falling back to in-memory rate limit store', { error: error.message })
    return new MemoryStore()
  }
}

export function getRateLimitStore() {
  if (!storePromise) storePromise = build()
  return storePromise
}
