import { cn } from '@/lib/cn'
import { StarIcon } from './Icon'

export function Rating({ value = 0, count, size = 14, className }) {
  const rounded = Math.round(value)

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5 text-amber-500" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon key={index} size={size} filled={index < rounded} />
        ))}
      </div>
      <span className="text-xs font-medium text-ink-500">
        {value.toFixed(1)}
        {count ? ` (${count})` : ''}
      </span>
      <span className="sr-only">{`Rated ${value.toFixed(1)} out of 5`}</span>
    </div>
  )
}
