import { cn } from '@/lib/cn'

export function Marquee({ items, className, itemClassName, speed = 32 }) {
  const doubled = [...items, ...items]

  return (
    <div className={cn('group relative overflow-hidden', className)}>
      <div
        className="flex w-max animate-marquee items-center gap-12 group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={cn('whitespace-nowrap text-sm font-semibold', itemClassName)}
            aria-hidden={index >= items.length}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
