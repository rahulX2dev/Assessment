import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { AvatarGroup } from '@/components/ui/Avatar'
import { pipelineStages } from '../data'

const proofPoints = ['No credit card required', '14-day full-feature trial', 'Live in under 48 hours']

function DashboardPreview() {
  return (
    <div className="rounded border border-ink-200 bg-white shadow-lift">
      <div className="flex items-center gap-2 border-b border-ink-200 px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        </span>
        <span className="ml-2 rounded bg-ink-50 px-2.5 py-1 font-mono text-[11px] text-ink-500">
          app.hubflow.io/campaigns
        </span>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-5 sm:p-5">
        <div className="hidden flex-col gap-1 sm:flex">
          {[
            { icon: 'grid', label: 'Overview', active: true },
            { icon: 'message', label: 'Inbox' },
            { icon: 'megaphone', label: 'Campaigns' },
            { icon: 'workflow', label: 'Pipeline' },
            { icon: 'chart', label: 'Reports' },
          ].map((item) => (
            <span
              key={item.label}
              className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs font-medium ${
                item.active ? 'bg-hub-50 text-hub-700' : 'text-ink-500'
              }`}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:col-span-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Sent today', value: '128.4K', delta: '+12.4%' },
              { label: 'Read rate', value: '84.2%', delta: '+3.1%' },
              { label: 'Replies', value: '9,412', delta: '+18.7%' },
            ].map((metric) => (
              <div key={metric.label} className="rounded border border-ink-200 p-3">
                <p className="text-[11px] font-medium text-ink-500">{metric.label}</p>
                <p className="mt-1 font-display text-base font-bold text-ink-900 sm:text-lg">
                  {metric.value}
                </p>
                <p className="text-[11px] font-semibold text-emerald-600">{metric.delta}</p>
              </div>
            ))}
          </div>

          <div className="rounded border border-ink-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-ink-800">Pipeline value by stage</p>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                Live
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2.5">
              {pipelineStages.map((stage) => (
                <div key={stage.name} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-[11px] font-medium text-ink-600">{stage.name}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded bg-ink-100">
                    <span
                      className={`block h-full rounded ${stage.tone}`}
                      style={{ width: `${Math.max(12, (stage.count / 184) * 100)}%` }}
                    />
                  </span>
                  <span className="w-12 shrink-0 text-right font-mono text-[11px] text-ink-500">
                    {stage.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
      <div
        className="grid-noise pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[860px] -translate-x-1/2 rounded-full bg-hub-200/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative shell">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <Reveal className="flex flex-col items-start gap-6">
            <Badge tone="brand">
              <Icon name="sparkles" size={13} />
              AI assistant now in general availability
            </Badge>

            <h1 className="font-display text-[2.4rem] font-bold leading-[1.08] tracking-tight text-ink-900 sm:text-5xl lg:text-[3.4rem]">
              Turn every WhatsApp conversation into
              <span className="text-hub-600"> pipeline you can measure.</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
              Hubflow brings campaigns, CRM, automation and billing into one workspace. Capture a lead,
              qualify it with AI, message it on the channel it actually reads, and bill it - without
              stitching five tools together.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button as="a" href="#cta" size="lg" className="sm:px-7">
                Start free trial
                <Icon name="arrowRight" size={16} />
              </Button>
              <Button as="a" href="#workflow" variant="light" size="lg">
                <Icon name="play" size={15} />
                Watch 3-min tour
              </Button>
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {proofPoints.map((point) => (
                <li key={point} className="flex items-center gap-1.5 text-sm text-ink-600">
                  <Icon name="check" size={15} className="text-emerald-600" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 border-t border-ink-200 pt-6">
              <AvatarGroup names={['Ritika Menon', 'Arjun Bhatt', 'Sneha Kulkarni', 'Dev Sharma']} />
              <p className="text-sm text-ink-600">
                <span className="font-semibold text-ink-900">3,200+ teams</span> ship campaigns on Hubflow
                every week.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:pl-4">
            <DashboardPreview />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
