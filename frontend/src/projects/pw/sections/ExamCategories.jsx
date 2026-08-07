import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { examCategories } from '../data'

function CategoryCard({ category }) {
  return (
    <article className="group relative flex h-full min-h-[230px] flex-col overflow-hidden rounded border border-ink-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div
        className={`pointer-events-none absolute -right-16 top-1/2 h-[150%] w-40 -translate-y-1/2 rounded-full ${category.arc}`}
        aria-hidden="true"
      />

      <Icon
        name={category.icon}
        size={44}
        strokeWidth={1.2}
        className={`pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 ${category.iconTone}`}
      />

      <div className="relative flex h-full flex-col">
        <h3 className="font-display text-xl font-bold text-ink-900">{category.name}</h3>

        {category.tags.length > 0 ? (
          <div className="mt-4 flex max-w-[62%] flex-wrap gap-2">
            {category.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-[13px] text-ink-700"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <a
          href="#batches"
          className="mt-auto inline-flex items-center gap-3 pt-5 text-[15px] font-medium text-ink-900"
        >
          Explore Category
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink-300 transition-colors group-hover:border-pw-600 group-hover:text-pw-600">
            <Icon name="arrowRight" size={15} />
          </span>
        </a>
      </div>
    </article>
  )
}

export function ExamCategories() {
  return (
    <Section className="py-14 sm:py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Exam Categories
        </h2>
        <p className="max-w-2xl text-base text-ink-600">
          PW is preparing students for 35+ exam categories. Scroll down to find the one you are
          preparing for
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {examCategories.map((category, index) => (
          <Reveal key={category.name} delay={Math.min(index, 5) * 60}>
            <CategoryCard category={category} />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="#batches"
          className="border-b-2 border-dashed border-pw-400 pb-1 text-[15px] font-medium text-pw-600 transition-colors hover:border-pw-600"
        >
          View All Categories (20)
        </a>
      </div>
    </Section>
  )
}
