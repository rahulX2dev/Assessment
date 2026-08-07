import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { integrationPaths, scaleStats } from '../data'

function SplitHeading({ lead, rest }) {
  return (
    <h2 className="max-w-3xl font-display text-[1.7rem] font-semibold leading-[1.28] tracking-tight text-white sm:text-[2.1rem]">
      {lead} <span className="text-stripe-nighttext">{rest}</span>
    </h2>
  )
}

function Node({ label, muted = false, filled = false }) {
  if (muted) {
    return <span className="h-9 w-24 rounded border border-dashed border-white/20" />
  }

  return (
    <span
      className={`inline-flex h-9 items-center justify-center rounded px-4 text-[13px] font-semibold ${
        filled ? 'bg-stripe-brand text-white' : 'bg-white/10 text-white'
      }`}
    >
      {label}
    </span>
  )
}

function SystemsDiagram() {
  return (
    <div className="relative mx-auto w-full max-w-3xl py-6">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded border border-white/15 p-2.5">
        <Node muted />
        <Node label="CRM" />
        <Node label="Subscriptions" />
        <Node muted />
        <Node label="Booking system" />
      </div>

      <div className="mt-6 flex items-center justify-center gap-24">
        <Node label="SDK" filled />
        <Node label="Event Destinations" filled />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <div className="grid grid-cols-3 gap-1.5 rounded border border-white/15 p-2">
          {['bag', 'card', 'target', 'flame', 'cloud', 'wallet'].map((icon, index) => (
            <span
              key={icon}
              className={`inline-flex h-9 w-9 items-center justify-center rounded text-white ${
                ['bg-amber-400', 'bg-sky-500', 'bg-blue-600', 'bg-orange-500', 'bg-slate-200', 'bg-emerald-600'][
                  index
                ]
              }`}
            >
              <Icon name={icon} size={16} />
            </span>
          ))}
        </div>

        <Node label="App Marketplace" filled />

        <span className="inline-flex h-20 w-24 items-center justify-center rounded bg-stripe-nightcard font-display text-sm font-bold text-white shadow-lift">
          stripe
        </span>

        <Node label="Data Pipeline" filled />

        <span className="inline-flex h-11 w-11 items-center justify-center rounded bg-white text-stripe-deep">
          <Icon name="grid" size={18} />
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <Node label="Orchestration" filled />
      </div>

      <div className="mt-5 flex justify-center gap-3">
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className="h-11 w-14 rounded border border-dashed border-white/20" />
        ))}
      </div>
    </div>
  )
}

const warmStrands = Array.from({ length: 42 }, (_, index) => {
  const t = index / 41
  return {
    key: `warm-${index}`,
    d: `M0 ${262 + t * 62} C 340 ${312 + t * 70}, 720 ${138 + t * 46}, 1200 ${292 + t * 118}`,
  }
})

const coolStrands = Array.from({ length: 58 }, (_, index) => {
  const t = index / 57
  return {
    key: `cool-${index}`,
    d: `M0 ${300 + t * 34} C 400 ${338 + t * 26}, 820 ${236 - t * 52}, 1200 ${18 + t * 250}`,
  }
})

function ScaleWave() {
  return (
    <svg
      className="h-64 w-full sm:h-80 lg:h-[26rem]"
      viewBox="0 0 1200 460"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wave-warm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.55" />
          <stop offset="22%" stopColor="#f97316" stopOpacity="0.85" />
          <stop offset="44%" stopColor="#fb7185" stopOpacity="1" />
          <stop offset="62%" stopColor="#ec4899" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.35" />
        </linearGradient>

        <linearGradient id="wave-cool" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.7" />
          <stop offset="28%" stopColor="#6d28d9" stopOpacity="0.85" />
          <stop offset="52%" stopColor="#d946ef" stopOpacity="1" />
          <stop offset="74%" stopColor="#8b5cf6" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#4338ca" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <g fill="none" strokeWidth="1.1">
        {warmStrands.map((strand) => (
          <path key={strand.key} d={strand.d} stroke="url(#wave-warm)" />
        ))}
        {coolStrands.map((strand) => (
          <path key={strand.key} d={strand.d} stroke="url(#wave-cool)" />
        ))}
      </g>
    </svg>
  )
}

function NoCodeMock() {
  return (
    <div className="flex gap-3">
      <div className="flex flex-1 flex-col gap-2">
        <span className="rounded bg-white/10 px-3 py-2 text-[11px] leading-snug text-white">
          Hi, I am looking for a simple day cream with SPF?
        </span>
        <span className="self-end rounded bg-stripe-brand px-3 py-2 text-[11px] leading-snug text-white">
          Sure, in that case, I would recommend our pure glow cream!
        </span>
        <span className="truncate rounded bg-white/10 px-3 py-2 font-mono text-[10px] text-sky-300">
          https://buy.stripe.com/test_eVa3do41l
        </span>
      </div>

      <div className="w-32 shrink-0 rounded bg-white/10 p-3 text-center">
        <p className="text-[10px] text-white/80">Pure glow cream</p>
        <p className="font-display text-sm font-bold text-white">₹1,899.99</p>
        <span className="mt-2 flex aspect-square items-center justify-center rounded bg-white">
          <Icon name="scan" size={30} className="text-ink-900" />
        </span>
        <p className="mt-1.5 text-[9px] text-white/70">Scan to pay</p>
      </div>
    </div>
  )
}

function PlatformGridMock() {
  const tones = [
    'bg-violet-600',
    'bg-white',
    'bg-purple-500',
    'bg-white',
    'bg-red-500',
    'bg-white',
    'bg-orange-500',
    'bg-blue-600',
    'bg-sky-100',
  ]

  return (
    <div className="grid grid-cols-5 gap-2">
      {tones.map((tone, index) => (
        <span key={index} className={`flex aspect-square items-center justify-center rounded ${tone}`}>
          <Icon
            name={['bag', 'layers', 'cloud', 'grid', 'flame', 'code', 'target', 'workflow', 'puzzle'][index % 9]}
            size={16}
            className={tone === 'bg-white' || tone === 'bg-sky-100' ? 'text-ink-800' : 'text-white'}
          />
        </span>
      ))}
    </div>
  )
}

function CodeMock() {
  return (
    <div className="overflow-hidden rounded bg-ink-950/80 font-mono text-[10.5px] leading-relaxed">
      <pre className="px-3 py-3 text-sky-200">
        <code>{`1  const stripe = require('stripe')(
2    'sk_test_abc123'
3  );
4  await stripe.
5
6`}</code>
      </pre>
      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5">
        <span className="rounded bg-stripe-brand px-1.5 py-0.5 text-[9px] font-bold text-white">
          NORMAL
        </span>
        <span className="text-[10px] text-white/70">server.js</span>
      </div>
      <p className="px-3 py-2 text-[10px] text-emerald-300">&gt; Ready! Waiting for requests...</p>
    </div>
  )
}

const pathMocks = { nocode: NoCodeMock, platforms: PlatformGridMock, build: CodeMock }

export function Developers() {
  return (
    <section id="developers" className="bg-stripe-night">
      <div className="shell py-16">
        <Reveal>
          <SplitHeading
            lead="Reliable, extensible infrastructure for every stack."
            rest="Adapt Stripe to your business needs with flexible integration options."
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#products"
              className="inline-flex h-11 items-center gap-1.5 rounded bg-stripe-brand px-6 text-[15px] font-semibold text-white transition-colors hover:bg-indigo-600"
            >
              View developer docs
              <Icon name="chevronRight" size={15} />
            </a>
            <a
              href="#products"
              className="inline-flex h-11 items-center rounded border border-white/25 px-6 text-[15px] font-semibold text-white transition-colors hover:border-white/50"
            >
              View Stripe&apos;s GitHub
            </a>
          </div>
        </Reveal>
      </div>

      <div className="border-t border-white/10">
        <div className="shell py-16">
          <Reveal>
            <SplitHeading
              lead="Connect to existing systems."
              rest="Orchestrate payments across multiple processors, build custom workflows, and connect to third parties using APIs, partner apps or pre-built integrations."
            />
          </Reveal>

          <Reveal delay={100}>
            <SystemsDiagram />
          </Reveal>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell py-16">
          <Reveal>
            <SplitHeading
              lead="Scale with confidence."
              rest="Handle thousands of transactions per second with consistent speed and reliability, even during peak traffic periods."
            />
          </Reveal>

          <Reveal delay={80} className="mt-6">
            <ScaleWave />
          </Reveal>

          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {scaleStats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 60}>
                <p
                  className={`bg-gradient-to-r bg-clip-text font-display text-[2.6rem] font-semibold tracking-tight text-transparent ${stat.gradient}`}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-white">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell py-16">
          <Reveal>
            <SplitHeading
              lead="Choose an integration path."
              rest="With AI-powered support, rich documentation, and built-in debugging tools, you can quickly get started with the best option for your business."
            />
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {integrationPaths.map((path, index) => {
              const Mock = pathMocks[path.mock]

              return (
                <Reveal key={path.title} delay={index * 70}>
                  <div className="flex h-full flex-col">
                    <div className="flex min-h-[240px] items-center rounded bg-stripe-nightcard p-5">
                      <div className="w-full">
                        <Mock />
                      </div>
                    </div>

                    <p className="mt-5 text-[15px] leading-relaxed text-stripe-nighttext">
                      <span className="font-semibold text-white">{path.title}</span> {path.detail}
                    </p>

                    <a
                      href="#products"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-300 hover:underline"
                    >
                      {path.linkLabel}
                      <Icon name="chevronRight" size={13} />
                    </a>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
