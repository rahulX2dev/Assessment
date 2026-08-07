import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { useCountUp } from '@/hooks/useCounter'
import { centreCities, heroStats } from '../data'

function formatIndian(value) {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1).replace('.0', '')} Cr`
  }
  if (value >= 100000) {
    return `${Math.round(value / 100000)} L`
  }
  return Math.round(value).toLocaleString('en-IN')
}

function StatItem({ value, suffix, label }) {
  const { ref, value: animated } = useCountUp(value)

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
        {formatIndian(animated)}
        <span className="text-pw-600">{suffix}</span>
      </p>
      <p className="mt-1.5 text-xs leading-snug text-ink-600 sm:text-sm">{label}</p>
    </div>
  )
}

export function Centres() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 py-16">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pw-950 via-ink-950 to-ink-900"
          aria-hidden="true"
        />
        <div className="grid-noise pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

        <div className="relative shell">
          <Reveal className="text-center">
            <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-[2rem]">
              Explore Tech-Enabled Offline Vidyapeeth and Pathshala Centres
            </h2>
            <p className="mt-2 text-sm text-white/70 sm:text-base">
              Creating new benchmarks in learning experiences
            </p>
          </Reveal>

          <Reveal delay={100} className="mx-auto mt-9 max-w-4xl rounded bg-white p-6 shadow-lift sm:p-9">
            <h3 className="text-center font-display text-lg font-bold text-ink-900 sm:text-xl">
              Find Vidyapeeth and Pathshala Centre in your city
            </h3>

            <div className="mt-4 flex items-center gap-4">
              <span className="h-px flex-1 bg-ink-200" />
              <p className="text-sm text-ink-600">
                Available in <span className="font-semibold text-pw-600">175+</span> cities
              </p>
              <span className="h-px flex-1 bg-ink-200" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {centreCities.map((city) => (
                <a
                  key={city}
                  href="#batches"
                  className="flex items-center gap-3 rounded border border-ink-200 p-2.5 transition-colors hover:border-pw-300 hover:bg-pw-50"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded bg-gradient-to-br from-pw-100 to-pw-200 text-pw-700">
                    <Icon name="target" size={18} />
                  </span>
                  <span className="text-sm font-medium text-ink-900">{city}</span>
                </a>
              ))}
            </div>

            <div className="mt-7 flex justify-center">
              <a
                href="#batches"
                className="inline-flex h-12 items-center justify-center rounded bg-pw-600 px-14 text-[15px] font-semibold text-white transition-colors hover:bg-pw-700"
              >
                View More
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="shell grid grid-cols-2 gap-6 lg:grid-cols-4">
          {heroStats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </section>
    </>
  )
}
