import { cn } from '@/lib/cn'
import { useReveal } from '@/hooks/useReveal'

export function Reveal({ as: Component = 'div', delay = 0, className, children, ...rest }) {
  const { ref, visible } = useReveal()

  return (
    <Component
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn('reveal', visible && 'reveal-in', className)}
      {...rest}
    >
      {children}
    </Component>
  )
}
