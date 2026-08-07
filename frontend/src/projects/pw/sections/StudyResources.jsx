import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { studyResources } from '../data'

export function StudyResources() {
  return (
    <Section className="py-14 sm:py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Study Resources
        </h2>
        <p className="max-w-2xl text-base text-ink-600">
          A diverse array of learning materials to enhance your educational journey.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {studyResources.map((resource, index) => (
          <Reveal key={resource.title} delay={index * 70}>
            <a
              href="#batches"
              className={`group flex h-full min-h-[340px] flex-col rounded p-7 transition duration-200 hover:-translate-y-1 hover:shadow-lift ${resource.surface}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl font-bold text-ink-900">{resource.title}</h3>
                {resource.arrow ? (
                  <Icon name="arrowRight" size={22} className="mt-1 shrink-0 text-ink-800" />
                ) : null}
              </div>

              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{resource.detail}</p>

              <div className="mt-auto flex flex-col items-center gap-5 pt-8">
                <Icon
                  name={resource.icon}
                  size={72}
                  strokeWidth={1}
                  className={resource.iconTone}
                />

                {resource.cta ? (
                  <span className="inline-flex h-10 items-center justify-center rounded bg-ink-950 px-6 text-sm font-semibold text-white">
                    Explore
                  </span>
                ) : null}
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
