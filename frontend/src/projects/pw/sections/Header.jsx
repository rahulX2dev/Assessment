import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { courseMenu, headerNav } from '../data'

function PwLogo() {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink-900">
      <span className="font-display text-sm font-bold leading-none tracking-tight text-ink-900">
        PW
      </span>
    </span>
  )
}

export function Header() {
  const scrolled = useScrollPosition(20)
  const [open, setOpen] = useState(false)
  const [coursesOpen, setCoursesOpen] = useState(false)

  useLockBodyScroll(open)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow',
        scrolled ? 'shadow-sm' : '',
      )}
    >
      <div className="shell flex h-[72px] items-center gap-4">
        <Link to="/pw" aria-label="Physics Wallah home">
          <PwLogo />
        </Link>

        <div
          className="relative ml-2 hidden lg:block"
          onMouseEnter={() => setCoursesOpen(true)}
          onMouseLeave={() => setCoursesOpen(false)}
        >
          <button
            type="button"
            aria-expanded={coursesOpen}
            onClick={() => setCoursesOpen((value) => !value)}
            className="inline-flex h-11 items-center gap-2 rounded border border-pw-600 px-5 text-[15px] font-semibold text-pw-600 transition-colors hover:bg-pw-50"
          >
            All Courses
            <Icon
              name="chevronDown"
              size={16}
              className={cn('transition-transform', coursesOpen && 'rotate-180')}
            />
          </button>

          {coursesOpen ? (
            <div className="absolute left-0 top-full w-[760px] pt-2">
              <div className="grid grid-cols-3 gap-x-6 gap-y-5 rounded border border-ink-200 bg-white p-6 shadow-lift">
                {courseMenu.map((group) => (
                  <div key={group.group}>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-pw-600">
                      {group.group}
                    </p>
                    <ul className="mt-2.5 flex flex-col gap-1.5">
                      {group.items.map((item) => (
                        <li key={item}>
                          <a
                            href="#batches"
                            className="text-sm text-ink-600 transition-colors hover:text-pw-600"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {headerNav.map((item) => (
            <a
              key={item.label}
              href="#batches"
              className="text-[15px] font-medium text-ink-900 transition-colors hover:text-pw-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="#batches"
            className="hidden h-11 items-center rounded bg-ink-900 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-black sm:inline-flex"
          >
            Login/Register
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded text-ink-900 lg:hidden"
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto border-t border-ink-100 bg-white lg:hidden">
          <nav className="shell flex flex-col py-4" aria-label="Mobile primary">
            {headerNav.map((item) => (
              <a
                key={item.label}
                href="#batches"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-ink-100 py-3.5 text-base font-medium text-ink-900"
              >
                {item.label}
                <Icon name="chevronRight" size={16} className="text-ink-400" />
              </a>
            ))}

            {courseMenu.map((group) => (
              <div key={group.group} className="border-b border-ink-100 py-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-pw-600">
                  {group.group}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                  {group.items.map((item) => (
                    <a
                      key={item}
                      href="#batches"
                      onClick={() => setOpen(false)}
                      className="text-sm text-ink-600"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            <a
              href="#batches"
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex h-12 items-center justify-center rounded bg-ink-900 px-6 text-[15px] font-semibold text-white"
            >
              Login/Register
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
