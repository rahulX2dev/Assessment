import { useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { formatInr } from '@/lib/format'
import { batchFilters, batches } from '../data'

function BatchCard({ batch }) {
  const discount = Math.round(((batch.mrp - batch.price) / batch.mrp) * 100)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded border border-ink-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-pw-300 hover:shadow-lift">
      <div className="relative flex h-28 items-end bg-gradient-to-br from-pw-700 to-pw-950 p-4">
        <div
          className="grid-noise absolute inset-0 opacity-30 mix-blend-overlay"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
            {batch.category}
          </p>
          <h3 className="mt-0.5 font-display text-lg font-bold text-white">{batch.name}</h3>
        </div>
        <span className="absolute right-3 top-3 rounded bg-white/15 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {batch.language}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-600">
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" size={13} />
            Starts {batch.starts}
          </span>
          <span
            className={cn(
              'flex items-center gap-1.5 font-medium',
              batch.seats === 'Open' ? 'text-emerald-600' : 'text-orange-600',
            )}
          >
            <Icon name="users" size={13} />
            {batch.seats}
          </span>
        </div>

        <ul className="flex flex-col gap-1.5">
          {batch.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-ink-700">
              <Icon name="check" size={14} className="mt-0.5 text-pw-700" />
              {feature}
            </li>
          ))}
        </ul>

        <p className="text-xs text-ink-500">Faculty: {batch.faculty.join(', ')}</p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-ink-100 pt-4">
          <div>
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-xl font-bold text-ink-900">
                {formatInr(batch.price)}
              </span>
              <span className="text-xs text-ink-400 line-through">{formatInr(batch.mrp)}</span>
            </p>
            <p className="text-[11px] font-semibold text-emerald-600">{discount}% off · full course</p>
          </div>

          <Button size="sm" className="bg-pw-700 hover:bg-pw-800">
            Explore
            <Icon name="arrowRight" size={14} />
          </Button>
        </div>
      </div>
    </article>
  )
}

export function Batches() {
  const [filter, setFilter] = useState('All')

  const visible = useMemo(
    () => (filter === 'All' ? batches : batches.filter((batch) => batch.category === filter)),
    [filter],
  )

  return (
    <Section id="batches" className="bg-ink-50/70 py-12 sm:py-16">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Batches taking admissions
          </h2>
          <p className="mt-1.5 text-sm text-ink-600">
            Fees include live classes, recordings, DPPs and printed modules.
          </p>
        </div>

        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          {batchFilters.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={cn(
                'shrink-0 rounded border px-3.5 py-2 text-sm font-semibold transition-colors',
                filter === option
                  ? 'border-pw-700 bg-pw-700 text-white'
                  : 'border-ink-200 bg-white text-ink-700 hover:border-pw-400 hover:text-pw-700',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((batch, index) => (
          <Reveal key={batch.id} delay={index * 60}>
            <BatchCard batch={batch} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
