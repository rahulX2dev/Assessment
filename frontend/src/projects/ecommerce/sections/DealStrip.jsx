import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

function useCountdown(target) {
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()))

  useEffect(() => {
    const timer = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000)
    return () => clearInterval(timer)
  }, [target])

  const totalSeconds = Math.floor(remaining / 1000)

  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
    seconds: String(totalSeconds % 60).padStart(2, '0'),
  }
}

export function DealStrip() {
  const endsAt = useMemo(() => {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    return end.getTime()
  }, [])

  const { hours, minutes, seconds } = useCountdown(endsAt)

  return (
    <section id="deal" className="bg-shop-deep py-10 text-white">
      <Reveal className="shell flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded bg-shop-accent">
            <Icon name="flame" size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Deal of the day
            </p>
            <p className="mt-1 font-display text-xl font-bold sm:text-2xl">
              Flat 26% off sitewide with code HUBUNI10
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-white/60">Ends in</span>
          <div className="flex items-center gap-1.5">
            {[
              { value: hours, label: 'hrs' },
              { value: minutes, label: 'min' },
              { value: seconds, label: 'sec' },
            ].map((unit) => (
              <span
                key={unit.label}
                className="flex min-w-14 flex-col items-center rounded border border-white/15 bg-white/5 px-2.5 py-1.5"
              >
                <span className="font-mono text-lg font-bold tabular-nums">{unit.value}</span>
                <span className="text-[10px] uppercase tracking-wide text-white/50">{unit.label}</span>
              </span>
            ))}
          </div>
        </div>

        <Button as="a" href="#products" variant="light" size="lg">
          Grab the deal
          <Icon name="arrowRight" size={16} />
        </Button>
      </Reveal>
    </section>
  )
}
