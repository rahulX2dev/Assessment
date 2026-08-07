import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Marquee } from '@/components/ui/Marquee'
import { brandStrip, promoCards, valueProps } from '../data'

export function Promo() {
  return (
    <>
      <Section className="py-12 sm:py-14">
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          {promoCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 80}>
              <div className={`flex h-full flex-col justify-between gap-6 rounded p-7 sm:p-9 ${card.tone}`}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-60">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed opacity-75">{card.detail}</p>
                </div>

                <a
                  href="#products"
                  className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
                >
                  {card.action}
                  <Icon name="arrowRight" size={15} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="border-y border-ink-200 bg-ink-50/70 py-10">
        <div className="shell grid grid-cols-2 gap-6 lg:grid-cols-4">
          {valueProps.map((prop) => (
            <div key={prop.title} className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white text-shop-accent shadow-ring">
                <Icon name={prop.icon} size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">{prop.title}</p>
                <p className="mt-0.5 text-xs leading-snug text-ink-600">{prop.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <Marquee
          items={brandStrip}
          speed={28}
          className="mt-10 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
          itemClassName="font-display text-lg text-ink-400"
        />
      </section>
    </>
  )
}
