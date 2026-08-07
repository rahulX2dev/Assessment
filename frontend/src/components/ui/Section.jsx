import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

export function Section({ id, className, children, containerClassName, ...rest }) {
  return (
    <section id={id} className={cn('py-16 sm:py-20 lg:py-24', className)} {...rest}>
      <div className={cn('shell', containerClassName)}>{children}</div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  className,
}) {
  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start'

  return (
    <Reveal className={cn('flex max-w-2xl flex-col gap-3', alignment, className)}>
      {eyebrow ? (
        <span className={cn('eyebrow', tone === 'dark' ? 'text-hub-300' : 'text-hub-600')}>
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          'font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl',
          tone === 'dark' ? 'text-white' : 'text-ink-900',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn('text-base leading-relaxed', tone === 'dark' ? 'text-ink-300' : 'text-ink-600')}>
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
