import { cn } from '@/lib/cn'

const tones = {
  neutral: 'bg-ink-100 text-ink-700 border-ink-200',
  brand: 'bg-hub-50 text-hub-700 border-hub-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  dark: 'bg-ink-900 text-white border-ink-900',
  invert: 'bg-white/10 text-white border-white/20',
}

export function Badge({ tone = 'neutral', className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

export function Dot({ className }) {
  return <span className={cn('h-1.5 w-1.5 rounded-full bg-current', className)} />
}
