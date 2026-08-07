import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { workflowTabs } from '../data'

export function Workflow() {
  const [activeId, setActiveId] = useState(workflowTabs[0].id)
  const active = workflowTabs.find((tab) => tab.id === activeId)

  return (
    <Section id="workflow">
      <SectionHeading
        eyebrow="Automation studio"
        title="Build the follow-up once, run it forever"
        description="Pick a trigger, chain the actions, publish. Every run is logged with its payload so you can replay a failure instead of guessing at it."
      />

      <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
        {workflowTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            aria-pressed={activeId === tab.id}
            className={cn(
              'rounded border px-4 py-2 text-sm font-semibold transition-colors',
              activeId === tab.id
                ? 'border-hub-600 bg-hub-600 text-white'
                : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:text-ink-900',
            )}
          >
            {tab.label}
          </button>
        ))}
      </Reveal>

      <Reveal className="mt-8 rounded border border-ink-200 bg-white p-5 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center gap-3 rounded border border-dashed border-hub-300 bg-hub-50/60 px-4 py-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-hub-600 text-white">
            <Icon name="bolt" size={16} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-hub-700">Trigger</p>
            <p className="text-sm font-semibold text-ink-900">{active.trigger}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {active.steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col gap-3 rounded border border-ink-200 p-4">
              <span className="absolute -top-2.5 left-4 rounded bg-white px-1.5 font-mono text-[11px] font-semibold text-ink-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-ink-50 text-ink-700">
                <Icon name={step.icon} size={17} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">{step.detail}</p>
              </div>

              {index < active.steps.length - 1 ? (
                <Icon
                  name="chevronRight"
                  size={16}
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-ink-300 lg:block"
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink-200 pt-5 text-xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <Icon name="clock" size={14} />
            Median run time 1.8s
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="refresh" size={14} />
            Automatic retry with backoff
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="file" size={14} />
            Full payload stored for 90 days
          </span>
        </div>
      </Reveal>
    </Section>
  )
}
