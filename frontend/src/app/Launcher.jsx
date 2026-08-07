import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import { projects } from '@/app/projects'

const stack = [
  { label: 'React 18 + Vite', icon: 'code' },
  { label: 'Tailwind CSS', icon: 'layers' },
  { label: 'React Router', icon: 'workflow' },
  { label: 'REST integration', icon: 'globe' },
]

export function Launcher() {
  return (
    <main className="min-h-screen bg-ink-950 text-white">
      <div className="grid-noise absolute inset-x-0 top-0 h-[520px] opacity-40" aria-hidden="true" />

      <div className="relative shell py-16 sm:py-24">
        <Reveal className="max-w-3xl">
          <Badge tone="invert">
            <Icon name="sparkles" size={13} />
            HubUnicon Technical Assessment
          </Badge>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Four responsive interfaces, one shared component system.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
            Every page below is built from the same design tokens, layout primitives and UI kit under{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">src/components/ui</code>.
            Routes are code split, data is fetched over REST with graceful fallbacks, and layouts are
            mobile-first from 320px upward.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-ink-200"
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 70}>
              <Link
                to={project.path}
                className="group flex h-full flex-col overflow-hidden rounded border border-white/10 bg-white/[0.04] transition duration-200 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${project.surface}`} />

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                        {project.tagline}
                      </p>
                      <h2 className="mt-1 font-display text-xl font-bold text-white">{project.name}</h2>
                    </div>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded border border-white/15 text-ink-300 transition-colors group-hover:border-white/40 group-hover:text-white">
                      <Icon name="arrowUpRight" size={16} />
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-ink-300">{project.summary}</p>

                  <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-2">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-1.5 text-xs text-ink-400">
                        <Icon name="check" size={13} className="text-emerald-400" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-ink-400">
          <p>
            Phase 1 deliverable. Backend services, database schema and deployment architecture live in{' '}
            <code className="font-mono text-ink-300">/backend</code>,{' '}
            <code className="font-mono text-ink-300">/database</code> and{' '}
            <code className="font-mono text-ink-300">/deployment</code>.
          </p>
        </footer>
      </div>
    </main>
  )
}
