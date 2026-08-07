import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

const variants = {
  primary: 'bg-hub-600 text-white hover:bg-hub-700 active:bg-hub-800 shadow-sm',
  dark: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-black shadow-sm',
  light: 'bg-white text-ink-900 hover:bg-ink-50 border border-ink-200 shadow-sm',
  outline: 'border border-ink-300 text-ink-800 hover:border-ink-400 hover:bg-ink-50',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
  soft: 'bg-hub-50 text-hub-700 hover:bg-hub-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
}

export const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    className,
    children,
    fullWidth = false,
    ...rest
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
})

export function IconButton({ label, className, children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded border border-ink-200 bg-white text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-900',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
