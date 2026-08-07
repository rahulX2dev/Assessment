import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { enterpriseCases, expertServices, globalStats } from '../data'

export function Global() {
  return (
    <>
      <section className="relative overflow-hidden bg-white py-20">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-sky-50 to-transparent"
          aria-hidden="true"
        />

        <Reveal className="relative shell">
          <h2 className="mx-auto max-w-2xl text-center font-display text-[2rem] font-semibold leading-[1.15] tracking-tight text-stripe-deep sm:text-[2.75rem]">
            The backbone of global commerce
          </h2>
        </Reveal>

        <div className="relative mt-14 border-t border-ink-100">
          <div className="shell grid grid-cols-2 gap-y-10 pt-12 lg:grid-cols-4">
            {globalStats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 55} className="text-center">
                <p
                  className={`font-display text-[2.2rem] font-semibold tracking-tight sm:text-[2.75rem] ${
                    index === 0 ? 'text-stripe-deep' : 'text-stripe-slate'
                  }`}
                >
                  {stat.value}
                </p>
                <p className="mx-auto mt-2 max-w-[12rem] text-sm leading-snug text-stripe-slate">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="enterprise" className="bg-white py-16">
        <div className="shell">
          <Reveal>
            <h2 className="max-w-3xl font-display text-[1.9rem] font-semibold leading-[1.2] tracking-tight text-stripe-deep sm:text-[2.4rem]">
              Powering businesses of all sizes.{' '}
              <span className="text-stripe-slate">
                Run your business on a reliable platform that adapts to your needs.
              </span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 border-t border-ink-100 pt-12 lg:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-stripe-deep sm:text-2xl">
                Transform your enterprise with agile financial infrastructure
              </h3>
              <a
                href="#cta"
                className="mt-6 inline-flex h-11 items-center gap-1.5 rounded bg-stripe-brand px-6 text-[15px] font-semibold text-white transition-colors hover:bg-indigo-600"
              >
                Stripe for enterprises
                <Icon name="chevronRight" size={15} />
              </a>
            </Reveal>

            <Reveal delay={80}>
              <p className="text-base leading-relaxed text-stripe-slate">
                50% of Fortune 100 companies have used Stripe to grow their businesses - from expanding
                internationally to reimagining the customer experience.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-amber-300 font-display text-sm font-bold italic text-ink-900">
                  H
                </span>
                <p className="text-lg font-medium text-stripe-deep">Hertz unifies commerce with Stripe.</p>
              </div>
              <a
                href="#cta"
                className="inline-flex h-10 items-center gap-1.5 rounded border border-ink-200 bg-white px-5 text-sm font-semibold text-stripe-brand transition-colors hover:border-stripe-brand"
              >
                Read the story
                <Icon name="chevronRight" size={14} />
              </a>
            </div>

            <div className="mt-6 h-56 rounded bg-gradient-to-br from-emerald-800 via-slate-600 to-slate-400 sm:h-72" />

            <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
              <p className="text-stripe-slate">
                <span className="font-semibold text-stripe-deep">160</span> countries
              </p>
              <p className="text-stripe-slate">
                <span className="font-semibold text-stripe-deep">11k+</span> locations globally
              </p>
              <p className="text-stripe-slate">
                <span className="font-semibold text-stripe-deep">Products used</span> Payments,
                Terminal, Connect, Radar and Stripe Sigma
              </p>
            </div>
          </Reveal>

          <div className="mt-10 flex flex-col">
            {enterpriseCases.map((entry, index) => (
              <Reveal key={entry.company} delay={index * 55}>
                <div className="flex items-center justify-between gap-4 border-t border-dashed border-ink-200 py-5">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded bg-ink-950 text-[10px] font-bold text-white">
                      {entry.mark}
                    </span>
                    <p className="text-[15px] text-stripe-deep sm:text-lg">{entry.headline}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Expand ${entry.company} story`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded bg-stripe-brand/10 text-stripe-brand transition-colors hover:bg-stripe-brand hover:text-white"
                  >
                    <Icon name="plus" size={16} />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16">
            <h3 className="font-display text-xl font-semibold tracking-tight text-stripe-deep sm:text-2xl">
              Realise value faster with dedicated experts
            </h3>

            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {expertServices.map((service) => (
                <div key={service.title}>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-stripe-brand/10 text-stripe-brand">
                    <Icon name={service.icon} size={17} />
                  </span>
                  <p className="mt-4 text-[15px] leading-relaxed text-stripe-slate">
                    <span className="font-semibold text-stripe-deep">{service.title}</span>{' '}
                    {service.detail}
                  </p>
                  <a
                    href="#cta"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-stripe-brand hover:underline"
                  >
                    {service.linkLabel}
                    <Icon name="chevronRight" size={13} />
                  </a>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
