import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'

export function Sessions() {
  return (
    <section className="bg-white py-10">
      <div className="shell">
        <Reveal className="relative overflow-hidden rounded bg-gradient-to-br from-violet-900 via-purple-700 to-orange-500 px-8 py-16 sm:px-12 sm:py-20">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <path
                key={index}
                d={`M0 ${120 + index * 34} C 300 ${40 + index * 30}, 700 ${260 + index * 22}, 1200 ${
                  90 + index * 30
                }`}
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          <div className="relative max-w-md">
            <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-[2.2rem]">
              Building the economic infrastructure for AI
            </h2>

            <a
              href="#cta"
              className="mt-7 inline-flex h-11 items-center gap-1.5 rounded bg-white px-6 text-[15px] font-semibold text-stripe-brand transition-colors hover:bg-ink-50"
            >
              Watch now
              <Icon name="chevronRight" size={15} />
            </a>
          </div>

          <p className="absolute bottom-6 right-8 font-display text-lg font-bold tracking-tight text-white">
            stripe <span className="font-normal">sessions</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
