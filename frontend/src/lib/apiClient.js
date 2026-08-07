const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 12000

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

function buildUrl(baseUrl, path, query) {
  const url = new URL(path.replace(/^\//, ''), baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }
  return url.toString()
}

export function createApiClient({ baseUrl, headers = {}, timeout = DEFAULT_TIMEOUT } = {}) {
  async function request(path, { method = 'GET', body, query, signal, ...rest } = {}) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    if (signal) {
      if (signal.aborted) controller.abort()
      else signal.addEventListener('abort', () => controller.abort(), { once: true })
    }

    try {
      const response = await fetch(buildUrl(baseUrl, path, query), {
        method,
        headers: {
          Accept: 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...rest,
      })

      const contentType = response.headers.get('content-type') || ''
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text()

      if (!response.ok) {
        throw new ApiError(
          typeof payload === 'object' && payload?.message ? payload.message : response.statusText,
          response.status,
          payload,
        )
      }

      return payload
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError('The request timed out. Please try again.', 408, null)
      }
      if (error instanceof ApiError) throw error
      throw new ApiError(error.message || 'Network request failed', 0, null)
    } finally {
      clearTimeout(timer)
    }
  }

  return {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
    put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
    del: (path, options) => request(path, { ...options, method: 'DELETE' }),
  }
}

export const storeApi = createApiClient({
  baseUrl: import.meta.env.VITE_STORE_API_URL || 'https://fakestoreapi.com',
})

export const hubflowApi = createApiClient({
  baseUrl: import.meta.env.VITE_GATEWAY_URL || '/api',
  timeout: Number(import.meta.env.VITE_GATEWAY_TIMEOUT) || 6000,
})
