import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { youtubeChannels } from '../data'

export function YoutubeChannels() {
  return (
    <Section className="py-12 sm:py-14">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Join The PW Family, Today!
        </h2>
        <p className="max-w-2xl text-sm text-ink-600">
          Explore our 130+ YouTube Channels and subscribe to get access to{' '}
          <span className="text-pw-600">quality education</span> for free.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {youtubeChannels.map((channel, index) => (
          <Reveal key={channel.name} delay={index * 60}>
            <a
              href="#batches"
              className={`flex h-full flex-col items-center gap-3 rounded p-6 text-center transition duration-200 hover:-translate-y-1 hover:shadow-card ${
                channel.featured ? 'bg-ink-100' : 'bg-[#fdf1de]'
              }`}
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded ${
                  channel.featured ? 'bg-ink-200 text-ink-500' : 'bg-amber-200/70 text-amber-700'
                }`}
              >
                <Icon name="play" size={20} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-900">{channel.name}</span>
                <span className="mt-0.5 block text-xs text-ink-500">{channel.subscribers}</span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <a
          href="#batches"
          className="inline-flex h-12 items-center justify-center rounded bg-pw-600 px-10 text-[15px] font-semibold text-white transition-colors hover:bg-pw-700"
        >
          Get Started
        </a>
      </div>
    </Section>
  )
}
