import { Section } from '@/components/ui/Section'
import { useCountUp } from '@/hooks/useCounter'
import { stats } from '../data'

function StatItem({ value, suffix, label }) {
  const { ref, value: animated } = useCountUp(value)
  const decimals = value % 1 !== 0 ? 2 : 0
  const display = animated.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <div ref={ref} className="border-l border-ink-200 pl-5 first:border-l-0 first:pl-0 sm:border-l sm:pl-6">
      <p className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
        {display}
        <span className="text-hub-600">{suffix}</span>
      </p>
      <p className="mt-2 text-sm leading-snug text-ink-600">{label}</p>
    </div>
  )
}

export function Stats() {
  return (
    <Section className="py-12 sm:py-16">
      <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </div>
    </Section>
  )
}
