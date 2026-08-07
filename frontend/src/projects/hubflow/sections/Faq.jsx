import { Section, SectionHeading } from '@/components/ui/Section'
import { Accordion } from '@/components/ui/Accordion'
import { Reveal } from '@/components/ui/Reveal'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { faqs } from '../data'

export function Faq() {
  return (
    <Section id="faq" className="bg-ink-50/60">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Questions we get on every demo call"
            className="max-w-none"
          />

          <Reveal delay={80} className="mt-8 rounded border border-ink-200 bg-white p-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-hub-50 text-hub-600">
              <Icon name="headset" size={17} />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink-900">Still unsure about something?</p>
            <p className="mt-1 text-sm text-ink-600">
              Solutions engineers answer within one working day, not a chatbot loop.
            </p>
            <Button as="a" href="#cta" variant="outline" size="sm" className="mt-4">
              Talk to the team
            </Button>
          </Reveal>
        </div>

        <Reveal delay={60}>
          <Accordion items={faqs} />
        </Reveal>
      </div>
    </Section>
  )
}
