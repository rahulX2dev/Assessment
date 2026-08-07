import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Avatar } from '@/components/ui/Avatar'
import { testimonials } from '../data'

export function Testimonials() {
  return (
    <Section id="customers">
      <SectionHeading
        eyebrow="Customers"
        title="Teams that stopped duct-taping tools together"
        description="Three different industries, one common problem - conversations happening somewhere the CRM could not see."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <Reveal key={item.name} delay={index * 80}>
            <figure className="flex h-full flex-col gap-5 rounded border border-ink-200 bg-white p-6 shadow-card">
              <Icon name="quote" size={22} className="text-hub-300" />

              <blockquote className="flex-1 text-sm leading-relaxed text-ink-700">
                {item.quote}
              </blockquote>

              <div className="rounded bg-hub-50 px-3 py-2">
                <p className="text-sm font-bold text-hub-700">{item.metric}</p>
              </div>

              <figcaption className="flex items-center gap-3 border-t border-ink-200 pt-4">
                <Avatar name={item.name} size={38} />
                <div>
                  <p className="text-sm font-semibold text-ink-900">{item.name}</p>
                  <p className="text-xs text-ink-500">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
