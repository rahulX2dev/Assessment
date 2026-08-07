import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import multer from 'multer'
import { config } from '../config/index.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncRoute, created, ok } from '../utils/respond.js'
import { authenticate } from '../middleware/auth.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { broadcast } from '../websocket/hub.js'
import { logger } from '../utils/logger.js'

const router = Router()

fs.mkdirSync(config.upload.dir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tenantDir = path.join(config.upload.dir, req.auth.tenantId)
    fs.mkdirSync(tenantDir, { recursive: true })
    cb(null, tenantDir)
  },
  filename: (req, file, cb) => {
    const safe = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${randomUUID().slice(0, 8)}-${safe}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxBytes, files: 1 },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()
    const mimeAllowed = config.upload.allowedMime.includes(file.mimetype)

    if (extension !== '.csv' || !mimeAllowed) {
      cb(ApiError.badRequest('Only CSV files are accepted', { received: file.mimetype }))
      return
    }

    cb(null, true)
  },
})

function previewCsv(filePath, limit = 5) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0)

  if (lines.length === 0) {
    throw ApiError.badRequest('The uploaded CSV is empty')
  }

  const headers = lines[0].split(',').map((header) => header.trim().replace(/^"|"$/g, ''))
  const required = ['phone', 'name']
  const missing = required.filter((column) => !headers.includes(column))

  if (missing.length) {
    throw ApiError.badRequest('CSV is missing required columns', { missing, headers })
  }

  const rows = lines.slice(1, limit + 1).map((line) => {
    const cells = line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''))
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']))
  })

  return { headers, rows, totalRows: lines.length - 1 }
}

router.post(
  '/contacts/csv',
  authenticate,
  rateLimit({ scope: 'upload', max: 20, windowMs: 60_000 }),
  upload.single('file'),
  asyncRoute(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('No file was uploaded under field "file"')

    let preview
    try {
      preview = previewCsv(req.file.path)
    } catch (error) {
      fs.unlink(req.file.path, () => {})
      throw error
    }

    const jobId = randomUUID()

    logger.info('csv accepted for import', {
      requestId: req.id,
      tenantId: req.auth.tenantId,
      jobId,
      rows: preview.totalRows,
    })

    broadcast({
      tenantId: req.auth.tenantId,
      channel: 'imports',
      event: 'import.queued',
      payload: { jobId, fileName: req.file.originalname, rows: preview.totalRows },
    })

    return created(res, {
      jobId,
      fileId: path.basename(req.file.path),
      fileName: req.file.originalname,
      sizeBytes: req.file.size,
      storedAt: req.file.path,
      totalRows: preview.totalRows,
      headers: preview.headers,
      preview: preview.rows,
      nextStep: 'Queued for the C++ ingestion engine via the core service',
    })
  }),
)

router.get(
  '/jobs/:jobId',
  authenticate,
  asyncRoute(async (req, res) =>
    ok(res, {
      jobId: req.params.jobId,
      state: 'processing',
      processed: 0,
      note: 'Live progress is pushed on the "imports" WebSocket channel',
    }),
  ),
)

export default router
