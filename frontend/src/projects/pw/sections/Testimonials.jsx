import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Avatar } from '@/components/ui/Avatar'
import { featuredStory, studentStories } from '../data'

function QuoteMark() {
  return (
    <span className="font-display text-3xl font-bold leading-none text-ink-300" aria-hidden="true">
      &ldquo;
    </span>
  )
}

export function Testimonials() {
  return (
    <Section className="py-14 sm:py-16">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Students
          <Icon name="heart" size={24} className="fill-rose-500 text-rose-500" />
          Physics Wallah
        </h2>
        <p className="text-sm text-rose-500">Hear from our students</p>
      </div>

      <Reveal className="mt-9 grid gap-6 rounded border border-ink-200 bg-white p-5 shadow-card lg:grid-cols-[0.85fr_1.15fr] lg:p-6">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded bg-gradient-to-br from-ink-900 to-ink-950">
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <p className="font-display text-xl font-extrabold uppercase tracking-tight text-white">
              {featuredStory.videoTitle}
            </p>
            <p className="text-right text-sm font-semibold text-rose-400">
              {featuredStory.videoSubtitle}
            </p>
          </div>
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink-900">
            <Icon name="play" size={20} />
          </span>
        </div>

        <figure className="flex flex-col gap-3">
          <QuoteMark />
          <blockquote className="text-sm leading-relaxed text-ink-700">
            {featuredStory.quote}
          </blockquote>
          <figcaption className="mt-auto flex items-center gap-3 pt-2">
            <Avatar name={featuredStory.name} size={38} />
            <div>
              <p className="text-sm font-semibold text-ink-900">{featuredStory.name}</p>
              <p className="text-xs text-pw-600">{featuredStory.credential}</p>
            </div>
          </figcaption>
        </figure>
      </Reveal>

      <div className="relative mt-5 grid gap-5 lg:grid-cols-3">
        {studentStories.map((story, index) => (
          <Reveal key={story.name} delay={index * 70}>
            <figure className="flex h-full flex-col gap-3 rounded border border-ink-200 bg-white p-5">
              <QuoteMark />
              <blockquote className="flex-1 text-[13px] leading-relaxed text-ink-600">
                {story.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-2">
                <Avatar name={story.name} size={34} />
                <div>
                  <p className="text-sm font-semibold text-ink-900">{story.name}</p>
                  <p className="text-[11px] text-pw-600">{story.credential}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}

        <button
          type="button"
          aria-label="Next testimonials"
          className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-700 shadow-card transition-colors hover:text-pw-600 lg:inline-flex"
        >
          <Icon name="chevronRight" size={17} />
        </button>
      </div>
    </Section>
  )
}
