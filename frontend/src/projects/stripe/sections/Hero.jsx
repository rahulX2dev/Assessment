import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Marquee } from '@/components/ui/Marquee'
import { Navbar } from './Navbar'
import { stripeLogos } from '../data'

const ribbonColors = [
  '#dbeafe',
  '#c7d2fe',
  '#a5b4fc',
  '#818cf8',
  '#6366f1',
  '#8b5cf6',
  '#f59e0b',
  '#fb923c',
  '#fb7185',
  '#ec4899',
  '#f472b6',
  '#fb923c',
  '#fdba74',
  '#c4b5fd',
  '#a78bfa',
]

function hexToRgb(hex) {
  const value = parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function sampleColor(position) {
  const scaled = position * (ribbonColors.length - 1)
  const index = Math.min(ribbonColors.length - 2, Math.floor(scaled))
  const local = scaled - index
  const from = hexToRgb(ribbonColors[index])
  const to = hexToRgb(ribbonColors[index + 1])
  const mixed = from.map((channel, axis) => Math.round(channel + (to[axis] - channel) * local))
  return `rgb(${mixed.join(',')})`
}

const strands = Array.from({ length: 150 }, (_, index) => {
  const position = index / 149

  return {
    key: index,
    color: sampleColor(position),
    width: 9 - position * 2.5,
    opacity: 0.5 + position * 0.4,
    d: `M${-140 + position * 430} -80
        C ${140 + position * 340} ${230 + position * 70},
          ${380 + position * 430} ${430 - position * 140},
          ${320 + position * 820} 980`,
  }
})

function GradientRibbon() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 900 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbon-fade" x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="16%" stopColor="white" stopOpacity="0.35" />
          <stop offset="34%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>

        <mask id="ribbon-mask">
          <rect width="900" height="900" fill="url(#ribbon-fade)" />
        </mask>

        <filter id="ribbon-soften">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <g mask="url(#ribbon-mask)" filter="url(#ribbon-soften)">
        {strands.map((strand) => (
          <path
            key={strand.key}
            d={strand.d}
            fill="none"
            stroke={strand.color}
            strokeWidth={strand.width}
            strokeLinecap="round"
            opacity={strand.opacity}
          />
        ))}
      </g>
    </svg>
  )
}

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute right-0 top-0 h-[820px] w-[78%] sm:w-[68%] lg:w-[58%]"
        aria-hidden="true"
      >
        <GradientRibbon />
      </div>

      <div className="relative">
        <Navbar />

        <div className="shell pb-14 pt-12 lg:pb-20 lg:pt-16">
          <Reveal className="max-w-[880px]">
            <p className="text-[15px] font-medium text-stripe-deep">
              Global GDP running on Stripe:{' '}
              <span className="font-normal text-ink-400">1.69408328%</span>
            </p>

            <h1 className="mt-7 font-display text-[2.15rem] font-semibold leading-[1.16] tracking-tight text-stripe-deep sm:text-[2.6rem] lg:text-[3rem]">
              Financial infrastructure to grow your{' '}
              <span className="text-stripe-brand">revenue.</span>{' '}
              <span className="text-stripe-slate">
                Accept payments, offer financial services and implement custom revenue models - from
                your first transaction to your billionth.
              </span>
            </h1>

            <a
              href="#cta"
              className="mt-9 inline-flex h-12 items-center justify-center gap-1.5 rounded bg-stripe-brand px-7 text-[15px] font-semibold text-white transition-colors hover:bg-indigo-600"
            >
              Request an invite
              <Icon name="chevronRight" size={16} />
            </a>
          </Reveal>
        </div>
      </div>

      <div className="relative border-t border-ink-100 bg-white/80 backdrop-blur-sm">
        <div className="shell py-8">
          <Marquee
            items={stripeLogos}
            speed={34}
            className="[mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
            itemClassName="font-display text-xl font-bold tracking-tight text-stripe-deep/70"
          />
        </div>
      </div>
    </div>
  )
}
