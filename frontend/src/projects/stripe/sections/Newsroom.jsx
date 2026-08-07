import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { bookOfTheWeek, newsHighlight } from '../data'

export function Newsroom() {
  return (
    <>
      <section className="bg-white py-16">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[1.7rem] font-semibold leading-tight tracking-tight text-stripe-deep sm:text-[2rem]">
              What&apos;s happening
              <span className="mt-1 block text-stripe-slate">See the latest from Stripe.</span>
            </h2>

            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous stories"
                className="inline-flex h-10 w-10 items-center justify-center rounded bg-stripe-brand/10 text-stripe-brand transition-colors hover:bg-stripe-brand hover:text-white"
              >
                <Icon name="arrowLeft" size={16} />
              </button>
              <button
                type="button"
                aria-label="Next stories"
                className="inline-flex h-10 w-10 items-center justify-center rounded bg-stripe-brand/10 text-stripe-brand transition-colors hover:bg-stripe-brand hover:text-white"
              >
                <Icon name="arrowRight" size={16} />
              </button>
            </div>
          </Reveal>

          <Reveal delay={80} className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="relative flex aspect-[16/9] items-end overflow-hidden rounded bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-8">
              <p className="font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Annual letter
                <span className="block">2025</span>
              </p>
              <span className="absolute bottom-8 right-8 h-6 w-9 rounded-sm bg-white/90" />
            </div>

            <div className="grid grid-cols-3 gap-3 lg:grid-cols-3">
              <span className="rounded bg-gradient-to-b from-amber-200 via-stone-400 to-stone-700" />
              <span className="rounded bg-gradient-to-b from-teal-700 via-teal-800 to-slate-900" />
              <span className="rounded bg-gradient-to-b from-stone-600 via-stone-700 to-ink-900" />
            </div>
          </Reveal>

          <Reveal delay={120} className="mt-8 flex flex-wrap items-start justify-between gap-6">
            <p className="max-w-2xl text-[15px] leading-relaxed text-stripe-slate sm:text-base">
              <span className="font-semibold text-stripe-deep">{newsHighlight.lead}</span>{' '}
              {newsHighlight.detail}
            </p>

            <a
              href="#cta"
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded border border-ink-200 bg-white px-6 text-[15px] font-semibold text-stripe-brand transition-colors hover:border-stripe-brand"
            >
              {newsHighlight.cta}
              <Icon name="chevronRight" size={15} />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="shell">
          <Reveal>
            <h2 className="font-display text-[1.7rem] font-semibold leading-tight tracking-tight text-stripe-deep sm:text-[2rem]">
              Book of the week
              <span className="mt-1 block text-stripe-slate">Entrepreneurship starts with ideas.</span>
            </h2>
          </Reveal>

          <Reveal delay={80} className="relative mt-10">
            <span className="absolute -top-6 right-6 z-10 hidden h-24 w-24 items-center justify-center rounded-full border border-stripe-slate/30 bg-white text-center text-[9px] leading-tight text-stripe-slate sm:inline-flex">
              The Library
              <br />
              of Stripe
            </span>

            <div className="grid overflow-hidden rounded lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex items-center justify-center bg-[#3a3a26] p-10">
                <div className="flex aspect-[2/3] w-full max-w-[240px] flex-col justify-between rounded-sm bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 p-4 text-center shadow-lift">
                  <p className="font-display text-lg font-bold uppercase tracking-wide text-stone-200">
                    Simon Schama
                  </p>
                  <p className="font-display text-base font-semibold uppercase leading-tight text-stone-100">
                    The Embarrassment of Riches
                  </p>
                  <p className="text-[10px] italic text-stone-300">
                    An Interpretation of Dutch Culture in the Golden Age
                  </p>
                </div>
              </div>

              <div className="bg-stripe-mist p-8 sm:p-10">
                <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-stripe-deep sm:text-2xl">
                  {bookOfTheWeek.title}
                </h3>
                <p className="mt-1 font-display text-xl text-stripe-slate sm:text-2xl">
                  {bookOfTheWeek.author}
                </p>

                <p className="mt-5 text-[15px] leading-relaxed text-stripe-slate">
                  {bookOfTheWeek.blurb}
                </p>

                <p className="mt-8 text-xs leading-relaxed text-stripe-slate">
                  {bookOfTheWeek.footnote}
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                  {bookOfTheWeek.publications.map((publication, index) => (
                    <a
                      key={publication}
                      href="#cta"
                      className="inline-flex items-center gap-2.5 rounded border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-stripe-deep transition-colors hover:border-stripe-brand"
                    >
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded ${
                          index === 0 ? 'bg-ink-950 text-white' : 'bg-ink-100 text-ink-700'
                        }`}
                      >
                        <Icon name={index === 0 ? 'book' : 'user'} size={14} />
                      </span>
                      {publication}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
