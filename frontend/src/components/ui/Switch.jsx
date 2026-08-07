import { cn } from '@/lib/cn'

export function Switch({ checked, onChange, label, hint, className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full border transition-colors duration-200',
          checked ? 'border-hub-600 bg-hub-600' : 'border-ink-300 bg-ink-200',
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked && 'translate-x-[20px]',
          )}
        />
      </button>
      {hint ? <span className="text-sm font-medium text-ink-700">{hint}</span> : null}
    </div>
  )
}

export function SegmentedControl({ options, value, onChange, className }) {
  return (
    <div className={cn('inline-flex rounded border border-ink-200 bg-ink-50 p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            'rounded px-4 py-1.5 text-sm font-semibold transition-colors',
            value === option.value
              ? 'bg-white text-ink-900 shadow-sm'
              : 'text-ink-600 hover:text-ink-900',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
