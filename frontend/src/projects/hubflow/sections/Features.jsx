import { Section, SectionHeading } from '@/components/ui/Section'
import { FeatureCard } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { Icon } from '@/components/ui/Icon'
import { features } from '../data'

export function Features() {
  return (
    <Section id="features" className="bg-ink-50/60">
      <SectionHeading
        eyebrow="Platform"
        title="One workspace instead of five subscriptions"
        description="Each module writes to the same tenant database, so a contact created by a campaign is the same record your billing and reports read."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 60}>
            <FeatureCard
              icon={<Icon name={feature.icon} size={18} />}
              title={feature.title}
              description={feature.description}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
