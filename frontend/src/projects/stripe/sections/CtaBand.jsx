import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { startCards } from '../data'

export function CtaBand() {
  return (
    <section id="cta" className="bg-stripe-mist py-20">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <h2 className="font-display text-[2rem] font-semibold leading-tight tracking-tight text-stripe-deep sm:text-[2.4rem]">
            Ready to get started?
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-stripe-slate">
            Create an account instantly, or contact us to design a custom package for your business.
          </p>

          <a
            href="#products"
            className="mt-8 inline-flex h-12 items-center gap-1.5 rounded bg-stripe-brand px-7 text-[15px] font-semibold text-white transition-colors hover:bg-indigo-600"
          >
            Contact sales
            <Icon name="chevronRight" size={16} />
          </a>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2">
          {startCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 70}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-stripe-brand/10 text-stripe-brand">
                <Icon name={card.icon} size={18} />
              </span>

              <p className="mt-4 font-semibold text-stripe-deep">{card.title}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-stripe-slate">{card.detail}</p>

              <a
                href="#products"
                className="mt-3 inline-flex items-center gap-1 text-[15px] font-semibold text-stripe-brand hover:underline"
              >
                {card.linkLabel}
                <Icon name="chevronRight" size={14} />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
