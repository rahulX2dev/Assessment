import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { platformBenefits, startupStories } from '../data'

export function Startups() {
  return (
    <>
      <section className="bg-white py-16">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-[1.6rem] font-semibold leading-snug tracking-tight text-stripe-deep sm:text-[1.9rem]">
                Build a foundation for your startup that enables faster growth
              </h2>
              <a
                href="#cta"
                className="mt-6 inline-flex h-11 items-center gap-1.5 rounded bg-stripe-brand px-6 text-[15px] font-semibold text-white transition-colors hover:bg-indigo-600"
              >
                Stripe for startups
                <Icon name="chevronRight" size={15} />
              </a>
            </Reveal>

            <Reveal delay={80} className="flex flex-col justify-between gap-6">
              <p className="text-base leading-relaxed text-stripe-slate">
                From stablecoin pioneers to 86% of the Forbes AI 50, Stripe helps startups build what
                is next on easy-to-integrate financial infrastructure.
              </p>

              <div className="flex gap-2 lg:justify-end">
                <button
                  type="button"
                  aria-label="Previous stories"
                  className="inline-flex h-10 w-10 items-center justify-center rounded border border-ink-200 text-stripe-slate transition-colors hover:text-stripe-brand"
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
          </div>

          <div className="no-scrollbar mt-10 flex gap-5 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {startupStories.map((story, index) => (
              <Reveal key={story.name} delay={index * 60} className="w-64 shrink-0 lg:w-auto">
                <div className="flex h-full flex-col">
                  <div
                    className={`relative flex aspect-[3/4] items-end overflow-hidden rounded bg-gradient-to-br p-4 ${story.surface}`}
                  >
                    <p className="font-display text-lg font-bold tracking-tight text-white">
                      {story.name}
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-stripe-deep">{story.caption}</p>

                  <a
                    href="#cta"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-stripe-brand hover:underline"
                  >
                    Read {story.name} story
                    <Icon name="chevronRight" size={13} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {[
              {
                title: 'Stripe Startups programme.',
                detail:
                  'Access financial benefits, a focused community, and expert resources to help you grow your business.',
                cta: 'Apply now',
                surface: 'from-fuchsia-500 to-purple-600',
              },
              {
                title: 'Stripe Atlas.',
                detail:
                  'Incorporate and get everything you need to fundraise, bank, and accept payments in two business days.',
                cta: 'Start your company',
                surface: 'from-amber-400 to-orange-500',
              },
            ].map((promo, index) => (
              <Reveal key={promo.title} delay={index * 70}>
                <div className="relative flex h-full items-center overflow-hidden rounded bg-stripe-mist p-7">
                  <div className="relative z-10 max-w-sm">
                    <p className="text-[15px] leading-relaxed text-stripe-slate">
                      <span className="font-semibold text-stripe-deep">{promo.title}</span>{' '}
                      {promo.detail}
                    </p>
                    <a
                      href="#cta"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-stripe-brand hover:underline"
                    >
                      {promo.cta}
                      <Icon name="arrowRight" size={14} />
                    </a>
                  </div>

                  <div
                    className={`pointer-events-none absolute -right-8 top-0 h-full w-48 bg-gradient-to-br ${promo.surface}`}
                    aria-hidden="true"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-[1.6rem] font-semibold leading-snug tracking-tight text-stripe-deep sm:text-[1.9rem]">
                Make your SaaS platform a complete financial operating system
              </h2>
              <a
                href="#cta"
                className="mt-6 inline-flex h-11 items-center gap-1.5 rounded bg-stripe-brand px-6 text-[15px] font-semibold text-white transition-colors hover:bg-indigo-600"
              >
                Stripe for platforms
                <Icon name="chevronRight" size={15} />
              </a>
            </Reveal>

            <Reveal delay={80}>
              <p className="text-base leading-relaxed text-stripe-slate">
                From the Fortune 100 to the Forbes Cloud 100, vertical SaaS platforms use Stripe to
                expand their product offerings with embedded payments and financial services.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-10 overflow-hidden rounded bg-gradient-to-br from-fuchsia-300 via-orange-300 to-amber-400 p-6 sm:p-10">
            <div className="overflow-hidden rounded bg-white shadow-lift">
              <div className="flex items-center gap-2 border-b border-ink-100 px-3 py-2">
                <span className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-ink-200" />
                  <span className="h-2 w-2 rounded-full bg-ink-200" />
                  <span className="h-2 w-2 rounded-full bg-ink-200" />
                </span>
                <span className="ml-2 rounded bg-ink-50 px-2 py-0.5 font-mono text-[10px] text-stripe-slate">
                  dashboard.zenflow.com
                </span>
              </div>

              <div className="grid sm:grid-cols-[150px_1fr]">
                <div className="bg-[#4a0d3f] p-3">
                  <p className="font-display text-xs font-bold text-white">Zenflow</p>
                  <ul className="mt-4 flex flex-col gap-2 text-[11px]">
                    {['Home', 'Payments', 'Reporting', 'Settings'].map((item, index) => (
                      <li key={item} className={index === 1 ? 'text-pink-300' : 'text-white/80'}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4">
                  <p className="text-xs font-semibold text-pink-600">Hello, Daybreak Yoga</p>

                  <div className="mt-3 rounded border border-ink-100 p-2.5">
                    <p className="text-[10px] font-semibold text-stripe-deep">Total balance</p>
                    <p className="font-display text-sm font-bold text-stripe-deep">₹77,953.20</p>
                  </div>

                  <p className="mt-3 text-[11px] font-semibold text-stripe-deep">Payments</p>
                  <table className="mt-1.5 w-full text-left text-[10px]">
                    <tbody>
                      {[
                        ['₹519.99', 'Succeeded', 'Mastercard 1234'],
                        ['₹1,519.99', 'Disputed', 'Visa 4010'],
                        ['₹94,999.00', 'Succeeded', 'Klarna'],
                      ].map((row) => (
                        <tr key={row[0]} className="border-t border-ink-50">
                          <td className="py-1.5 text-stripe-deep">{row[0]}</td>
                          <td className="py-1.5">
                            <span
                              className={`rounded px-1.5 py-0.5 ${
                                row[1] === 'Succeeded'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-ink-100 text-ink-600'
                              }`}
                            >
                              {row[1]}
                            </span>
                          </td>
                          <td className="py-1.5 text-stripe-slate">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {platformBenefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 60}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-stripe-brand/10 text-stripe-brand">
                  <Icon name={benefit.icon} size={17} />
                </span>
                <p className="mt-4 text-[15px] leading-relaxed text-stripe-slate">
                  <span className="font-semibold text-stripe-deep">{benefit.title}</span>{' '}
                  {benefit.detail}
                </p>
                <a
                  href="#cta"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-stripe-brand hover:underline"
                >
                  Read the guide
                  <Icon name="chevronRight" size={13} />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
