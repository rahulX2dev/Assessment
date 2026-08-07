import { config } from '../config/index.js'

const levels = { error: 0, warn: 1, info: 2, debug: 3 }
const threshold = config.isProduction ? levels.info : levels.debug

function emit(level, message, meta) {
  if (levels[level] > threshold) return

  const entry = {
    ts: new Date().toISOString(),
    level,
    service: 'api-gateway',
    message,
    ...(meta || {}),
  }

  const line = JSON.stringify(entry)
  if (level === 'error') process.stderr.write(`${line}\n`)
  else process.stdout.write(`${line}\n`)
}

export const logger = {
  error: (message, meta) => emit('error', message, meta),
  warn: (message, meta) => emit('warn', message, meta),
  info: (message, meta) => emit('info', message, meta),
  debug: (message, meta) => emit('debug', message, meta),
}
