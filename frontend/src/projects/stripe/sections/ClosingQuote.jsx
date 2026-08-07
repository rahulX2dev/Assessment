import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { closingTestimonial } from '../data'

export function ClosingQuote() {
  return (
    <section className="bg-white py-16">
      <Reveal className="shell flex flex-col items-center text-center">
        <p className="font-display text-xl font-bold tracking-tight text-stripe-deep">
          {closingTestimonial.brand}
        </p>

        <blockquote className="mt-8 max-w-3xl font-display text-xl font-medium leading-relaxed text-stripe-slate sm:text-[1.6rem]">
          &ldquo;{closingTestimonial.quote}&rdquo;
        </blockquote>

        <p className="mt-8 text-[15px] text-stripe-slate">
          <span className="font-semibold text-stripe-deep">{closingTestimonial.name}</span>{' '}
          {closingTestimonial.role}
        </p>

        <a
          href="#cta"
          className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-stripe-brand hover:underline"
        >
          Read the story
          <Icon name="chevronRight" size={14} />
        </a>
      </Reveal>

      <div className="mt-14 border-t border-ink-100">
        <div className="shell grid grid-cols-2 items-center gap-y-8 pt-10 sm:grid-cols-4">
          {closingTestimonial.logos.map((logo, index) => (
            <span
              key={logo}
              className={`text-center font-display text-lg font-bold tracking-tight ${
                index === 0 ? 'text-stripe-deep' : 'text-stripe-slate/60'
              }`}
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
