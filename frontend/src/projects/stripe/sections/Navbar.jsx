import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { stripeNav } from '../data'

function NavItem({ item, open, onToggle }) {
  if (item.href) {
    return (
      <a
        href={item.href}
        className="rounded px-3 py-2 text-[15px] font-medium text-stripe-deep transition-colors hover:text-stripe-brand"
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
        className="inline-flex items-center gap-1 rounded px-3 py-2 text-[15px] font-medium text-stripe-deep transition-colors hover:text-stripe-brand"
      >
        {item.label}
        <Icon name="chevronDown" size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open ? (
        <div className="absolute left-1/2 top-full w-[430px] -translate-x-1/2 pt-3">
          <div className="grid grid-cols-2 gap-1 rounded bg-white p-3 shadow-lift">
            {item.items.map((entry) => (
              <a
                key={entry.title}
                href="#products"
                className="flex gap-2.5 rounded p-2.5 transition-colors hover:bg-stripe-mist"
              >
                <Icon name={entry.icon} size={17} className="mt-0.5 shrink-0 text-stripe-brand" />
                <span>
                  <span className="block text-sm font-semibold text-stripe-deep">{entry.title}</span>
                  <span className="mt-0.5 block text-xs text-stripe-slate">{entry.description}</span>
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
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useLockBodyScroll(mobileOpen)

  return (
    <header className="relative z-50">
      <div className="shell flex h-[88px] items-center gap-6">
        <Link to="/stripe" className="font-display text-[26px] font-bold tracking-tight text-stripe-deep">
          stripe
        </Link>

        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {stripeNav.map((item) => (
            <NavItem key={item.label} item={item} open={openMenu === item.label} onToggle={setOpenMenu} />
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <a
            href="#cta"
            className="inline-flex h-10 items-center rounded bg-white px-5 text-[15px] font-semibold text-amber-600 shadow-ring transition-colors hover:text-amber-700"
          >
            Sign in
          </a>
          <a
            href="#cta"
            className="inline-flex h-10 items-center gap-1 rounded bg-stripe-brand px-5 text-[15px] font-semibold text-white transition-colors hover:bg-indigo-600"
          >
            Contact sales
            <Icon name="chevronRight" size={14} />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded text-stripe-deep lg:hidden"
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} size={21} />
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-[88px] z-40 overflow-y-auto bg-white lg:hidden">
          <div className="shell flex flex-col gap-6 py-6">
            {stripeNav.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-stripe-deep"
                >
                  {item.label}
                </a>
              ) : (
                <div key={item.label} className="flex flex-col gap-3">
                  <p className="eyebrow text-stripe-slate">{item.label}</p>
                  {item.items.map((entry) => (
                    <a
                      key={entry.title}
                      href="#products"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5"
                    >
                      <Icon name={entry.icon} size={17} className="text-stripe-brand" />
                      <span>
                        <span className="block text-sm font-semibold text-stripe-deep">
                          {entry.title}
                        </span>
                        <span className="block text-xs text-stripe-slate">{entry.description}</span>
                      </span>
                    </a>
                  ))}
                </div>
              ),
            )}

            <a
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex h-11 items-center justify-center rounded bg-stripe-brand font-semibold text-white"
            >
              Request an invite
            </a>
          </div>
        </div>
      ) : null}
    </header>
  )
}
