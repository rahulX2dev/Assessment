import { useCallback, useEffect, useRef, useState } from 'react'

export function useAsync(task, { deps = [], immediate = true, fallback = null } = {}) {
  const [state, setState] = useState({
    data: fallback,
    error: null,
    loading: immediate,
    degraded: false,
  })

  const taskRef = useRef(task)
  taskRef.current = task

  const run = useCallback(
    async (signal) => {
      setState((previous) => ({ ...previous, loading: true, error: null }))
      try {
        const data = await taskRef.current(signal)
        if (signal?.aborted) return
        setState({ data, error: null, loading: false, degraded: false })
      } catch (error) {
        if (signal?.aborted) return
        setState({
          data: fallback,
          error,
          loading: false,
          degraded: fallback !== null,
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fallback],
  )

  useEffect(() => {
    if (!immediate) return undefined
    const controller = new AbortController()
    run(controller.signal)
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ...state, refetch: () => run() }
}
