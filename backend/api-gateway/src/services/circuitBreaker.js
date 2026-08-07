import { logger } from '../utils/logger.js'

const CLOSED = 'closed'
const OPEN = 'open'
const HALF_OPEN = 'half-open'

export class CircuitBreaker {
  constructor(name, { failureThreshold = 5, resetTimeoutMs = 15_000, successThreshold = 2 } = {}) {
    this.name = name
    this.failureThreshold = failureThreshold
    this.resetTimeoutMs = resetTimeoutMs
    this.successThreshold = successThreshold

    this.state = CLOSED
    this.failures = 0
    this.successes = 0
    this.openedAt = 0
  }

  canAttempt() {
    if (this.state === CLOSED) return true

    if (this.state === OPEN) {
      if (Date.now() - this.openedAt >= this.resetTimeoutMs) {
        this.state = HALF_OPEN
        this.successes = 0
        logger.info('circuit half-open', { circuit: this.name })
        return true
      }
      return false
    }

    return true
  }

  recordSuccess() {
    if (this.state === HALF_OPEN) {
      this.successes += 1
      if (this.successes >= this.successThreshold) {
        this.state = CLOSED
        this.failures = 0
        logger.info('circuit closed', { circuit: this.name })
      }
      return
    }

    this.failures = 0
  }

  recordFailure() {
    this.failures += 1

    if (this.state === HALF_OPEN || this.failures >= this.failureThreshold) {
      this.state = OPEN
      this.openedAt = Date.now()
      logger.warn('circuit opened', { circuit: this.name, failures: this.failures })
    }
  }

  snapshot() {
    return {
      name: this.name,
      state: this.state,
      failures: this.failures,
      retryInMs: this.state === OPEN ? Math.max(0, this.resetTimeoutMs - (Date.now() - this.openedAt)) : 0,
    }
  }
}
