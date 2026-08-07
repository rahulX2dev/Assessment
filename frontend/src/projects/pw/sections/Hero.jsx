import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { valueProps } from '../data'

function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      <div className="absolute left-[6%] top-[28%] h-[52%] w-[52%] rounded-full border-2 border-dashed border-pw-300/70" />
      <div className="absolute right-[4%] top-[2%] h-[56%] w-[56%] rounded-full border-2 border-dashed border-pw-300/70" />

      <span className="absolute left-[4%] top-[26%] h-3 w-3 rounded-full bg-sky-400" />
      <span className="absolute right-[2%] top-[30%] h-3 w-3 rounded-full bg-rose-400" />
      <span className="absolute left-[22%] bottom-[16%] h-2.5 w-2.5 rounded-full bg-orange-400" />
      <span className="absolute right-[26%] top-[1%] h-2.5 w-2.5 rounded-full bg-sky-400" />

      <div className="absolute left-[12%] top-[36%] flex h-[40%] w-[40%] items-end justify-center overflow-hidden rounded-full bg-pw-100">
        <Icon name="user" size={92} className="translate-y-2 text-pw-600/70" />
      </div>

      <div className="absolute right-[10%] top-[10%] flex h-[40%] w-[40%] items-end justify-center overflow-hidden rounded-full bg-pw-100">
        <Icon name="user" size={92} className="translate-y-2 text-pw-500/70" />
      </div>

      <div className="absolute right-[16%] top-[2%] rounded border border-ink-200 bg-white px-3 py-2 shadow-card">
        <p className="whitespace-nowrap text-xs font-medium text-ink-800">Alakh Sir, What is PW?</p>
      </div>

      <div className="absolute left-[38%] top-[46%] max-w-[62%] rounded bg-pw-950 px-3.5 py-2.5 shadow-lift">
        <p className="text-xs font-medium leading-snug text-white">
          PW is where students learn with love and can grow with guidance
        </p>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-pwsurface via-[#fdf4fb] to-[#eef4ff]">
      <div className="shell grid items-center gap-8 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-14">
        <Reveal className="flex flex-col items-start">
          <h1 className="font-display text-[2.3rem] font-bold leading-[1.15] tracking-tight text-ink-900 sm:text-[2.9rem]">
            Bharat&apos;s <span className="text-pw-600">Trusted &amp; Affordable</span> Educational
            Platform
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-700">
            Unlock your potential by signing up with Physics Wallah - The most affordable learning
            solution
          </p>

          <a
            href="#batches"
            className="mt-8 inline-flex h-14 items-center justify-center rounded bg-pw-600 px-12 text-base font-semibold text-white transition-colors hover:bg-pw-700"
          >
            Get Started
          </a>
        </Reveal>

        <Reveal delay={120}>
          <HeroIllustration />
        </Reveal>
      </div>

      <div className="shell pb-14 pt-10">
        <Reveal className="rounded border border-ink-100 bg-white px-2 py-7 shadow-card sm:px-6">
          <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
            {valueProps.map((prop, index) => (
              <div
                key={prop.value}
                className={`flex flex-col items-center gap-2.5 px-3 text-center ${
                  index > 0 ? 'lg:border-l lg:border-ink-100' : ''
                } ${index % 2 === 1 ? 'border-l border-ink-100 lg:border-l' : ''}`}
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded ${prop.tone}`}>
                  <Icon name={prop.icon} size={22} />
                </span>
                <p className="font-display text-base font-bold text-ink-900 sm:text-lg">{prop.value}</p>
                <p className="text-xs leading-snug text-ink-600 sm:text-sm">{prop.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
