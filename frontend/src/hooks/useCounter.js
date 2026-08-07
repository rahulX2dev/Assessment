import { useEffect, useState } from 'react'
import { useReveal } from './useReveal'

export function useCountUp(target, { duration = 1400 } = {}) {
  const { ref, visible } = useReveal({ threshold: 0.4 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!visible) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setValue(target)
      return undefined
    }

    let frame = 0
    const start = performance.now()

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [visible, target, duration])

  return { ref, value }
}
