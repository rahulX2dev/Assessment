import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Rating } from '@/components/ui/Rating'
import { Avatar } from '@/components/ui/Avatar'
import { shopTestimonials } from '../data'

export function Reviews() {
  return (
    <Section className="py-12 sm:py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          4.7 average from 18,400 reviews
        </h2>
        <p className="max-w-md text-sm text-ink-600">
          Verified purchases only. We publish the one and two-star ones too.
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:gap-5 lg:grid-cols-3">
        {shopTestimonials.map((review, index) => (
          <Reveal key={review.name} delay={index * 70}>
            <figure className="flex h-full flex-col gap-4 rounded border border-ink-200 bg-white p-6">
              <Rating value={review.rating} size={15} />
              <blockquote className="flex-1 text-sm leading-relaxed text-ink-700">
                {review.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-ink-100 pt-4">
                <Avatar name={review.name} size={36} />
                <div>
                  <p className="text-sm font-semibold text-ink-900">{review.name}</p>
                  <p className="text-xs text-ink-500">{review.location} · Verified buyer</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
