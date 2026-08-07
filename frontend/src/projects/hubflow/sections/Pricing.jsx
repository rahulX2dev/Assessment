import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import { Skeleton } from '@/components/ui/Skeleton'
import { SegmentedControl } from '@/components/ui/Switch'
import { formatInr } from '@/lib/format'
import { hubflowApi } from '@/lib/apiClient'
import { useAsync } from '@/hooks/useAsync'
import { fallbackPlans } from '../data'

const cycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly · save 17%' },
]

function PlanSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded border border-ink-200 bg-white p-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-full" />
      <div className="mt-2 flex flex-col gap-2.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-3 w-4/5" />
        ))}
      </div>
      <Skeleton className="mt-auto h-11 w-full" />
    </div>
  )
}

export function Pricing() {
  const [cycle, setCycle] = useState('monthly')

  const { data: plans, loading, degraded } = useAsync(
    (signal) => hubflowApi.get('/v1/billing/plans', { signal }).then((response) => response.data),
    { fallback: fallbackPlans },
  )

  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="Transparent plans, no per-message surprises"
        description="Platform pricing is fixed. Meta conversation charges are passed through at cost on a separate invoice line."
      />

      <Reveal className="mt-8 flex flex-col items-center gap-3">
        <SegmentedControl options={cycles} value={cycle} onChange={setCycle} />
        {degraded ? (
          <p className="flex items-center gap-1.5 text-xs text-amber-700">
            <Icon name="cloud" size={13} />
            Gateway unreachable - showing the last published price list.
          </p>
        ) : null}
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }, (_, index) => <PlanSkeleton key={index} />)
          : plans.map((plan, index) => {
              const amount = cycle === 'monthly' ? plan.monthly : plan.yearly
              const custom = amount === 0

              return (
                <Reveal key={plan.id} delay={index * 70}>
                  <div
                    className={cn(
                      'relative flex h-full flex-col gap-5 rounded border bg-white p-6',
                      plan.featured
                        ? 'border-hub-600 shadow-lift lg:-mt-4 lg:pb-10'
                        : 'border-ink-200 shadow-card',
                    )}
                  >
                    {plan.featured ? (
                      <Badge tone="brand" className="absolute -top-3 left-6">
                        Most popular
                      </Badge>
                    ) : null}

                    <div>
                      <h3 className="font-display text-lg font-bold text-ink-900">{plan.name}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{plan.description}</p>
                    </div>

                    <div>
                      {custom ? (
                        <p className="font-display text-3xl font-bold text-ink-900">Let's talk</p>
                      ) : (
                        <p className="flex items-baseline gap-1">
                          <span className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
                            {formatInr(amount)}
                          </span>
                          <span className="text-sm text-ink-500">
                            /{cycle === 'monthly' ? 'month' : 'year'}
                          </span>
                        </p>
                      )}
                      <p className="mt-1 text-xs text-ink-500">
                        {custom ? 'Volume pricing based on throughput' : 'Billed to your registered GSTIN'}
                      </p>
                    </div>

                    <ul className="flex flex-col gap-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-ink-700">
                          <Icon name="check" size={15} className="mt-0.5 text-emerald-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      as="a"
                      href="#cta"
                      variant={plan.featured ? 'primary' : 'outline'}
                      fullWidth
                      className="mt-auto"
                    >
                      {custom ? 'Contact sales' : 'Start free trial'}
                    </Button>
                  </div>
                </Reveal>
              )
            })}
      </div>
    </Section>
  )
}
