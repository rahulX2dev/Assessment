import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { navigation } from '../data'

function DesktopMenu({ item, open, onToggle }) {
  if (item.href) {
    return (
      <a
        href={item.href}
        className="rounded px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
      >
        {item.label}
      </a>
    )
  }

  return (
    <div className="relative" onMouseEnter={() => onToggle(item.label)} onMouseLeave={() => onToggle(null)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => onToggle(open ? null : item.label)}
        className="inline-flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
      >
        {item.label}
        <Icon name="chevronDown" size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full w-[420px] pt-2">
          <div className="grid grid-cols-2 gap-1 rounded border border-ink-200 bg-white p-2 shadow-lift">
            {item.items.map((entry) => (
              <a
                key={entry.title}
                href="#features"
                className="flex gap-3 rounded p-3 transition-colors hover:bg-ink-50"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded bg-hub-50 text-hub-600">
                  <Icon name={entry.icon} size={16} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{entry.title}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-ink-500">
                    {entry.description}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function Navbar() {
  const scrolled = useScrollPosition(8)
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useLockBodyScroll(mobileOpen)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors duration-200',
        scrolled ? 'border-ink-200 bg-white/90 backdrop-blur' : 'border-transparent bg-white',
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link to="/hubflow" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-hub-600 text-white">
            <Icon name="bolt" size={17} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">Hubflow</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navigation.map((item) => (
            <DesktopMenu
              key={item.label}
              item={item}
              open={openMenu === item.label}
              onToggle={setOpenMenu}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button as="a" href="#pricing" variant="ghost" size="sm">
            Sign in
          </Button>
          <Button as="a" href="#cta" size="sm">
            Start free trial
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded border border-ink-200 text-ink-800 lg:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} size={19} />
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-ink-200 bg-white lg:hidden">
          <div className="shell flex flex-col gap-6 py-6">
            {navigation.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-ink-900"
                >
                  {item.label}
                </a>
              ) : (
                <div key={item.label} className="flex flex-col gap-3">
                  <p className="eyebrow text-ink-400">{item.label}</p>
                  {item.items.map((entry) => (
                    <a
                      key={entry.title}
                      href="#features"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-hub-50 text-hub-600">
                        <Icon name={entry.icon} size={16} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-ink-900">{entry.title}</span>
                        <span className="block text-xs text-ink-500">{entry.description}</span>
                      </span>
                    </a>
                  ))}
                </div>
              ),
            )}

            <div className="mt-2 flex flex-col gap-2 border-t border-ink-200 pt-6">
              <Button as="a" href="#cta" onClick={() => setMobileOpen(false)} fullWidth>
                Start free trial
              </Button>
              <Button
                as="a"
                href="#pricing"
                variant="outline"
                fullWidth
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
