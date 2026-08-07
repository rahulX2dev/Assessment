import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { appHighlights } from '../data'

function StoreBadge({ platform, label }) {
  return (
    <a
      href="#batches"
      className="inline-flex items-center gap-3 rounded bg-ink-950 px-5 py-2.5 text-white transition-colors hover:bg-black"
    >
      <Icon name={platform === 'ios' ? 'bag' : 'play'} size={24} />
      <span className="text-left">
        <span className="block text-[10px] uppercase tracking-wide text-white/70">
          {platform === 'ios' ? 'Download on the' : 'Get it on'}
        </span>
        <span className="block font-display text-base font-bold leading-tight">{label}</span>
      </span>
    </a>
  )
}

function PhoneMock() {
  return (
    <div className="relative mx-auto w-56">
      <div className="overflow-hidden rounded border-[6px] border-ink-900 bg-white shadow-lift">
        <div className="flex items-center justify-center bg-ink-900 py-1.5">
          <span className="h-1 w-12 rounded-full bg-ink-700" />
        </div>

        <div className="flex items-center gap-2 border-b border-ink-100 px-3 py-2">
          <span className="h-6 flex-1 rounded bg-ink-100" />
          <span className="rounded bg-pw-600 px-2 py-1 text-[9px] font-semibold text-white">Study</span>
        </div>

        <div className="flex flex-col gap-2 p-3">
          <div className="rounded bg-pw-50 p-2.5">
            <p className="text-[10px] font-semibold text-pw-700">2 Dedicated Personal Coaches</p>
            <p className="mt-0.5 text-[9px] text-ink-500">Guidance from the planning stage</p>
          </div>

          <div className="overflow-hidden rounded border border-ink-100">
            <div className="bg-gradient-to-r from-rose-500 to-pw-600 px-2.5 py-3">
              <p className="text-[10px] font-bold text-white">DROPPER NEET</p>
              <p className="text-[8px] text-white/80">Target 2026</p>
            </div>
            <div className="flex items-center justify-between px-2.5 py-2">
              <span className="font-display text-[11px] font-bold text-ink-900">₹11,000</span>
              <span className="rounded bg-pw-600 px-2 py-1 text-[8px] font-semibold text-white">
                BUY NOW
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AppDownload() {
  return (
    <section id="app" className="bg-white py-10">
      <div className="shell">
        <Reveal className="grid items-center gap-8 rounded bg-[#e8e3fc] px-6 py-10 sm:px-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
              Join 15 Million students on the app today!
            </h2>

            <ul className="flex flex-col gap-3.5">
              {appHighlights.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-ink-800">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pw-600 text-white">
                    <Icon name="check" size={13} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-2 flex flex-wrap gap-4">
              <StoreBadge platform="android" label="Google Play" />
              <StoreBadge platform="ios" label="App Store" />
            </div>
          </div>

          <div className="hidden lg:block">
            <PhoneMock />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
