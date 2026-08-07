import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { resultFilters, toppers } from '../data'

function TopperCard({ topper }) {
  return (
    <div className="flex w-[92px] shrink-0 flex-col items-center">
      <div className="relative">
        <div className="flex h-[76px] w-[70px] items-end justify-center overflow-hidden rounded border border-ink-200 bg-gradient-to-b from-sky-50 to-sky-100">
          <Icon name="user" size={52} className="translate-y-1 text-ink-400" />
        </div>
        <span className="absolute -bottom-2.5 left-1/2 w-[86px] -translate-x-1/2 rounded bg-pw-950 py-1 text-center text-[11px] font-bold text-white">
          {topper.rank}
        </span>
      </div>
      <p className="mt-5 text-center text-[11px] leading-tight text-ink-700">{topper.name}</p>
    </div>
  )
}

export function Results() {
  const [active, setActive] = useState(resultFilters[0])

  return (
    <Section className="py-14 sm:py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Academic Excellence : Results
        </h2>
        <p className="text-base font-semibold text-ink-800">
          Giving wings to a millions dreams, a million more to go
        </p>
      </div>

      <div className="no-scrollbar -mx-5 mt-8 flex gap-3 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {resultFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            aria-pressed={active === filter}
            className={cn(
              'shrink-0 rounded-full border px-5 py-2.5 text-sm transition-colors',
              active === filter
                ? 'border-pw-600 bg-pw-50 font-semibold text-pw-700'
                : 'border-ink-200 bg-white text-ink-700 hover:border-pw-300',
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <Reveal className="relative mt-6">
        <div className="rounded bg-gradient-to-b from-[#fdf6e3] to-[#fefcf5] px-4 py-8 sm:px-8">
          <span className="absolute right-6 top-6 hidden h-14 w-14 items-center justify-center rounded-full border-2 border-ink-900 bg-white sm:inline-flex">
            <span className="font-display text-xs font-bold text-ink-900">PW</span>
          </span>

          <p className="text-center font-display text-3xl font-extrabold tracking-tight text-sky-500 sm:text-5xl">
            {active.toUpperCase().replace('RESULT', '').trim()} RESULT
          </p>

          <div className="no-scrollbar mt-8 flex justify-start gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:gap-x-4 sm:gap-y-7 sm:overflow-visible">
            {toppers.map((topper) => (
              <TopperCard key={topper.rank} topper={topper} />
            ))}
          </div>

          <p className="mt-8 text-center font-display text-xl font-bold text-sky-600">&amp; Many More!</p>
        </div>

        <button
          type="button"
          aria-label="Next result set"
          className="absolute -right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-700 shadow-card transition-colors hover:text-pw-600 lg:inline-flex"
        >
          <Icon name="chevronRight" size={18} />
        </button>
      </Reveal>
    </Section>
  )
}
