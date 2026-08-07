import { cn } from '@/lib/cn'
import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { categoryTiles } from '../data'

export function Categories({ activeCategory, onSelect }) {
  return (
    <Section className="py-12 sm:py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Shop by category
          </h2>
          <p className="mt-1.5 text-sm text-ink-600">Filters apply to the catalogue below instantly.</p>
        </div>
        <button
          type="button"
          onClick={() => onSelect('all')}
          className="hidden text-sm font-semibold text-shop-accent hover:underline sm:block"
        >
          View everything
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categoryTiles.map((tile, index) => {
          const active = activeCategory === tile.id

          return (
            <Reveal key={tile.id} delay={index * 60}>
              <button
                type="button"
                onClick={() => onSelect(active ? 'all' : tile.id)}
                aria-pressed={active}
                className={cn(
                  'flex w-full items-center gap-3 rounded border p-4 text-left transition duration-200 sm:flex-col sm:items-start sm:gap-4 sm:p-5',
                  active
                    ? 'border-shop-accent bg-shop-soft'
                    : 'border-ink-200 bg-white hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card',
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-11 w-11 items-center justify-center rounded',
                    active ? 'bg-shop-accent text-white' : 'bg-ink-50 text-ink-700',
                  )}
                >
                  <Icon name={tile.icon} size={19} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-900 sm:text-base">
                    {tile.label}
                  </span>
                  <span className="block text-xs text-ink-500">{tile.caption}</span>
                </span>
              </button>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
