import { cn } from '@/lib/cn'

export function Card({ as: Component = 'div', className, interactive = false, children, ...rest }) {
  return (
    <Component
      className={cn(
        'rounded border border-ink-200 bg-white p-6 shadow-card',
        interactive && 'transition duration-200 hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-lift',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}

export function FeatureCard({ icon, title, description, footer, className }) {
  return (
    <Card interactive className={cn('flex h-full flex-col gap-4', className)}>
      {icon ? (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-hub-50 text-hub-600">
          {icon}
        </span>
      ) : null}
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-ink-900">{title}</h3>
        <p className="text-sm leading-relaxed text-ink-600">{description}</p>
      </div>
      {footer ? <div className="mt-auto pt-2">{footer}</div> : null}
    </Card>
  )
}

export function StatCard({ value, label, hint, className }) {
  return (
    <div className={cn('rounded border border-ink-200 bg-white p-5', className)}>
      <p className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink-700">{label}</p>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </div>
  )
}
