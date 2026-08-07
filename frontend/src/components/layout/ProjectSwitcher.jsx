import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import { projects } from '@/app/projects'

export function ProjectSwitcher() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const active = projects.find((project) => pathname.startsWith(project.path))

  if (pathname === '/') return null

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-2 print:hidden">
      {open ? (
        <div className="w-64 rounded border border-ink-200 bg-white p-2 shadow-lift">
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Assessment projects
          </p>
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={project.path}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-2.5 rounded px-2 py-2 text-sm transition-colors hover:bg-ink-50',
                active?.slug === project.slug ? 'bg-ink-50 font-semibold text-ink-900' : 'text-ink-700',
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: project.accent }} />
              <span className="flex-1">{project.name}</span>
              <span className="text-[11px] text-ink-400">{project.tagline}</span>
            </Link>
          ))}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2 rounded border-t border-ink-100 px-2 py-2 text-sm text-ink-600 hover:bg-ink-50"
          >
            <Icon name="grid" size={15} />
            All projects
          </Link>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Switch assessment project"
        className="inline-flex h-11 items-center gap-2 rounded bg-ink-900 px-4 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-ink-800"
      >
        <Icon name={open ? 'close' : 'layers'} size={16} />
        <span className="hidden sm:inline">{active ? active.name : 'Projects'}</span>
      </button>
    </div>
  )
}
