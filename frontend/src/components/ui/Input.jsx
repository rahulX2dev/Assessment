import { forwardRef, useId } from 'react'
import { cn } from '@/lib/cn'

export const Input = forwardRef(function Input(
  { label, hint, error, className, wrapperClassName, ...rest },
  ref,
) {
  const id = useId()

  return (
    <div className={cn('flex w-full flex-col gap-1.5', wrapperClassName)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ink-800">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(
          'h-11 w-full rounded border bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors',
          error ? 'border-red-400' : 'border-ink-300 hover:border-ink-400',
          className,
        )}
        {...rest}
      />
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-ink-500">{hint}</p> : null}
    </div>
  )
})
