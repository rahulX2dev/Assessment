import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Navbar } from './Navbar'
import { stripeLogos } from '../data'

const bands = [
  { d: 'M540 0 C 470 260, 470 520, 620 900 L 760 900 C 700 520, 660 250, 700 0 Z', from: '#a5b4fc', to: '#c7d2fe' },
  { d: 'M700 0 C 660 250, 700 520, 760 900 L 880 900 C 830 520, 800 250, 840 0 Z', from: '#818cf8', to: '#a78bfa' },
  { d: 'M840 0 C 800 250, 830 520, 880 900 L 1010 900 C 960 520, 930 250, 970 0 Z', from: '#f59e0b', to: '#fb923c' },
  { d: 'M970 0 C 930 250, 960 520, 1010 900 L 1150 900 C 1090 520, 1060 250, 1100 0 Z', from: '#fb7185', to: '#f472b6' },
  { d: 'M1100 0 C 1060 250, 1090 520, 1150 900 L 1300 900 C 1230 520, 1200 250, 1240 0 Z', from: '#f472b6', to: '#fb7185' },
  { d: 'M1240 0 C 1200 250, 1230 520, 1300 900 L 1440 900 L 1440 0 Z', from: '#fda4af', to: '#fdba74' },
]

function GradientRibbon() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
    >
      <defs>
        {bands.map((band, index) => (
          <linearGradient key={index} id={`ribbon-${index}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor={band.from} />
            <stop offset="100%" stopColor={band.to} />
          </linearGradient>
        ))}
        <filter id="ribbon-blur">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <g filter="url(#ribbon-blur)">
        {bands.map((band, index) => (
          <path key={index} d={band.d} fill={`url(#ribbon-${index})`} opacity="0.92" />
        ))}
      </g>
    </svg>
  )
}

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute -right-20 top-0 h-[860px] w-[70%] sm:-right-10 lg:right-0 lg:w-[58%]"
        aria-hidden="true"
      >
        <GradientRibbon />
      </div>

      <div className="relative">
        <Navbar />

        <div className="shell pb-16 pt-10 lg:pb-24 lg:pt-16">
          <Reveal className="max-w-[760px]">
            <p className="text-[15px] font-medium text-stripe-deep">
              Global GDP running on Stripe:{' '}
              <span className="font-normal text-ink-400">1.69408328%</span>
            </p>

            <h1 className="mt-8 font-display text-[2.4rem] font-semibold leading-[1.14] tracking-tight text-stripe-deep sm:text-[3.1rem]">
              Financial infrastructure to grow your{' '}
              <span className="text-stripe-brand">revenue.</span>
              <span className="block text-stripe-slate">
                Accept payments, offer financial services and implement custom revenue models - from
                your first transaction to your billionth.
              </span>
            </h1>

            <a
              href="#cta"
              className="mt-10 inline-flex h-12 items-center justify-center gap-1.5 rounded bg-stripe-brand px-7 text-[15px] font-semibold text-white transition-colors hover:bg-indigo-600"
            >
              Request an invite
              <Icon name="chevronRight" size={16} />
            </a>
          </Reveal>
        </div>
      </div>

      <div className="relative border-t border-ink-100">
        <div className="shell grid grid-cols-2 items-center gap-y-8 py-10 sm:grid-cols-4 lg:grid-cols-8">
          {stripeLogos.slice(0, 8).map((logo) => (
            <span
              key={logo}
              className="text-center font-display text-lg font-bold tracking-tight text-stripe-deep/70"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
