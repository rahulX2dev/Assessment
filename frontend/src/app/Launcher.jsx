import { Link } from 'react-router-dom'
import { BrandIcon, Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Avatar } from '@/components/ui/Avatar'
import { projects } from '@/app/projects'

const stack = [
  { label: 'React 18 + Vite', icon: 'code' },
  { label: 'Tailwind CSS', icon: 'layers' },
  { label: 'React Router', icon: 'workflow' },
  { label: 'REST integration', icon: 'globe' },
]

const contactLinks = [
  {
    label: 'github.com/rahulX2dev',
    href: 'https://github.com/rahulX2dev',
    brand: 'github',
  },
  {
    label: 'linkedin.com/in/rahul-pathak-a3bb25246',
    href: 'https://www.linkedin.com/in/rahul-pathak-a3bb25246',
    brand: 'linkedin',
  },
]

const deliverables = [
  { label: '4 responsive interfaces', icon: 'grid' },
  { label: '5 backend runtimes', icon: 'workflow' },
  { label: 'MySQL, PostgreSQL, Redis', icon: 'database' },
  { label: 'Docker and Kubernetes', icon: 'cloud' },
]

function IntroCard() {
  return (
    <div className="overflow-hidden rounded border border-ink-200 bg-white shadow-card">
      <div className="h-1.5 w-full bg-gradient-to-r from-hub-500 via-violet-500 to-orange-400" />

      <div className="p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <Avatar name="Rahul Pathak" size={56} />

          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink-900">Rahul Pathak</h2>
            <p className="mt-0.5 text-sm text-ink-600">
              Full-stack developer · Frontend, APIs and systems
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink-600">
          I built this submission end to end - four responsive React interfaces on one shared design
          system, a five-runtime backend for the Hubflow Automation SaaS, the data layer across three
          stores, and the container and Kubernetes deployment that runs it.
        </p>

        <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {deliverables.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm text-ink-700">
              <Icon name={item.icon} size={15} className="text-hub-600" />
              {item.label}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2 border-t border-ink-100 pt-5">
          <a
            href="mailto:rahulpathak7966@gmail.com"
            className="group inline-flex items-center gap-2.5 text-sm text-ink-700 transition-colors hover:text-hub-700"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-ink-50 text-ink-600 transition-colors group-hover:bg-hub-50 group-hover:text-hub-600">
              <Icon name="mail" size={15} />
            </span>
            rahulpathak7966@gmail.com
          </a>

          {contactLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2.5 text-sm text-ink-700 transition-colors hover:text-hub-700"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-ink-50 text-ink-600 transition-colors group-hover:bg-hub-50 group-hover:text-hub-600">
                <BrandIcon name={link.brand} size={15} />
              </span>
              <span className="truncate">{link.label}</span>
              <Icon
                name="arrowUpRight"
                size={13}
                className="shrink-0 text-ink-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Launcher() {
  return (
    <main className="min-h-screen bg-white">
      <div
        className="grid-noise pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60"
        aria-hidden="true"
      />

      <div className="relative shell py-14 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded border border-hub-200 bg-hub-50 px-3 py-1.5 text-xs font-semibold text-hub-700">
              <Icon name="sparkles" size={13} />
              HubUnicon Technical Assessment
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink-900 sm:text-5xl">
              Four responsive interfaces, one shared component system.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
              Every page below is built from the same design tokens, layout primitives and UI kit under{' '}
              <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-sm text-ink-800">
                src/components/ui
              </code>
              . Routes are code split, data is fetched over REST with graceful fallbacks, and layouts
              are mobile-first from 320px upward.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-700"
                >
                  <Icon name={item.icon} size={14} className="text-hub-600" />
                  {item.label}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={110}>
            <IntroCard />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 70}>
              <Link
                to={project.path}
                className="group flex h-full flex-col overflow-hidden rounded border border-ink-200 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${project.surface}`} />

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                        {project.tagline}
                      </p>
                      <h2 className="mt-1 font-display text-xl font-bold text-ink-900">
                        {project.name}
                      </h2>
                    </div>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded border border-ink-200 text-ink-500 transition-colors group-hover:border-hub-300 group-hover:bg-hub-50 group-hover:text-hub-600">
                      <Icon name="arrowUpRight" size={16} />
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-ink-600">{project.summary}</p>

                  <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-2">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-1.5 text-xs text-ink-500">
                        <Icon name="check" size={13} className="text-emerald-600" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <footer className="mt-14 border-t border-ink-200 pt-8">
          <p className="text-sm text-ink-600">
            Phase 1 deliverable. Backend services, database schema and deployment architecture live in{' '}
            <code className="font-mono text-ink-800">/backend</code>,{' '}
            <code className="font-mono text-ink-800">/database</code> and{' '}
            <code className="font-mono text-ink-800">/deployment</code>.
          </p>
        </footer>
      </div>
    </main>
  )
}
