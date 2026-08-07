import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { announcements, primaryNav } from '../data'
import { useCart } from '../CartContext'

function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((value) => (value + 1) % announcements.length), 4200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-shop-deep py-2 text-center text-xs font-medium text-white">
      <p key={index} className="animate-rise">
        {announcements[index]}
      </p>
    </div>
  )
}

export function Header({ onSearch, searchTerm }) {
  const scrolled = useScrollPosition(40)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, setOpen } = useCart()

  useLockBodyScroll(menuOpen)

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />

      <div
        className={cn(
          'border-b bg-white transition-shadow',
          scrolled ? 'border-ink-200 shadow-sm' : 'border-ink-100',
        )}
      >
        <div className="shell flex h-16 items-center gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded text-ink-800 lg:hidden"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>

          <Link to="/ecommerce" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-shop-accent text-white">
              <Icon name="bag" size={16} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink-900">Kanvas</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-6 lg:flex" aria-label="Categories">
            {primaryNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-shop-accent',
                  item.accent ? 'text-shop-accent' : 'text-ink-700',
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <div className="relative hidden md:block">
              <Icon
                name="search"
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <label htmlFor="product-search" className="sr-only">
                Search products
              </label>
              <input
                id="product-search"
                type="search"
                value={searchTerm}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Search products"
                className="h-10 w-56 rounded border border-ink-200 bg-ink-50 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-400 focus:bg-white lg:w-64"
              />
            </div>

            <button
              type="button"
              aria-label="Account"
              className="inline-flex h-10 w-10 items-center justify-center rounded text-ink-700 hover:bg-ink-100"
            >
              <Icon name="user" size={18} />
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Open cart, ${count} items`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded text-ink-700 hover:bg-ink-100"
            >
              <Icon name="bag" size={18} />
              {count > 0 ? (
                <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-shop-accent px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="shell pb-3 md:hidden">
          <div className="relative">
            <Icon
              name="search"
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <label htmlFor="product-search-mobile" className="sr-only">
              Search products
            </label>
            <input
              id="product-search-mobile"
              type="search"
              value={searchTerm}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search products"
              className="h-10 w-full rounded border border-ink-200 bg-ink-50 pl-9 pr-3 text-sm placeholder:text-ink-400 focus:border-ink-400 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-[104px] z-40 overflow-y-auto bg-white lg:hidden">
          <nav className="shell flex flex-col py-4" aria-label="Mobile categories">
            {primaryNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between border-b border-ink-100 py-3.5 text-base font-medium',
                  item.accent ? 'text-shop-accent' : 'text-ink-900',
                )}
              >
                {item.label}
                <Icon name="chevronRight" size={16} className="text-ink-400" />
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
