import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { integrations } from '../data'

export function Integrations() {
  return (
    <Section id="integrations" className="bg-ink-50/60">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Integrations"
          title="Plugs into the stack you already run"
          description="Native connectors for the tools Indian revenue teams actually use, plus signed webhooks and a documented REST API for everything else."
          className="max-w-none"
        />

        <Reveal delay={80} className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center gap-2 rounded border border-ink-200 bg-white p-4 text-center transition-colors hover:border-ink-300"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-ink-50 text-ink-600">
                <Icon name={item.icon} size={17} />
              </span>
              <span className="text-[11px] font-medium leading-tight text-ink-700">{item.name}</span>
            </div>
          ))}
        </Reveal>
      </div>

      <Reveal className="mt-10 flex flex-col items-start gap-4 rounded border border-ink-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-ink-900 text-white">
            <Icon name="code" size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-900">Building something custom?</p>
            <p className="text-sm text-ink-600">
              REST endpoints, WebSocket events and a Postman collection ship with every account.
            </p>
          </div>
        </div>
        <Button as="a" href="#faq" variant="outline" size="sm">
          Read the API docs
          <Icon name="arrowUpRight" size={15} />
        </Button>
      </Reveal>
    </Section>
  )
}
