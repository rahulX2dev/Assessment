import { Marquee } from '@/components/ui/Marquee'
import { trustedBy } from '../data'

export function LogoStrip() {
  return (
    <section className="border-y border-ink-200 bg-ink-50/60 py-8">
      <div className="shell">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
          Powering revenue teams across India
        </p>
        <Marquee
          items={trustedBy}
          className="mt-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
          itemClassName="font-display text-lg text-ink-400"
        />
      </div>
    </section>
  )
}
