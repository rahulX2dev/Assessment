export function ok(res, data, meta) {
  return res.json({ success: true, data, ...(meta ? { meta } : {}) })
}

export function created(res, data) {
  return res.status(201).json({ success: true, data })
}

export function accepted(res, data) {
  return res.status(202).json({ success: true, data })
}

export function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}
