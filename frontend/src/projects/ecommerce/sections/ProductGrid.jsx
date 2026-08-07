import { useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { storeApi } from '@/lib/apiClient'
import { useAsync } from '@/hooks/useAsync'
import { ProductCard } from '../components/ProductCard'
import { fallbackProducts } from '../data'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]

const PAGE_SIZE = 8

export function ProductGrid({ category, searchTerm, onResetFilters }) {
  const [sort, setSort] = useState('featured')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const { data: products, loading, error, degraded, refetch } = useAsync(
    (signal) => storeApi.get('/products', { signal }),
    { fallback: fallbackProducts },
  )

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    const matched = products.filter((product) => {
      const inCategory = category === 'all' || product.category === category
      const inSearch =
        term.length === 0 ||
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      return inCategory && inSearch
    })

    const sorted = [...matched]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'rating') sorted.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))

    return sorted
  }, [products, category, searchTerm, sort])

  const hasFilters = category !== 'all' || searchTerm.trim().length > 0

  return (
    <Section id="products" className="py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Trending right now
          </h2>
          <p className="mt-1.5 text-sm text-ink-600">
            {loading ? 'Loading catalogue...' : `${filtered.length} products available`}
            {degraded ? ' · offline catalogue' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasFilters ? (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex h-10 items-center gap-1.5 rounded border border-ink-200 px-3 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              <Icon name="close" size={14} />
              Clear filters
            </button>
          ) : null}

          <div className="relative">
            <Icon
              name="filter"
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <label htmlFor="sort-products" className="sr-only">
              Sort products
            </label>
            <select
              id="sort-products"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-10 appearance-none rounded border border-ink-200 bg-white pl-9 pr-8 text-sm font-medium text-ink-800 focus:border-ink-400"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevronDown"
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400"
            />
          </div>
        </div>
      </div>

      {degraded ? (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded border border-amber-200 bg-amber-50 px-4 py-3">
          <Icon name="cloud" size={16} className="text-amber-700" />
          <p className="flex-1 text-sm text-amber-800">
            Could not reach the catalogue API{error?.status ? ` (${error.status})` : ''}. Showing a cached
            sample so the page stays usable.
          </p>
          <Button variant="outline" size="sm" onClick={refetch}>
            <Icon name="refresh" size={14} />
            Retry
          </Button>
        </div>
      ) : null}

      <div
        className={cn(
          'mt-7 grid gap-4 sm:gap-5',
          'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        )}
      >
        {loading
          ? Array.from({ length: PAGE_SIZE }, (_, index) => <ProductCardSkeleton key={index} />)
          : filtered.slice(0, visible).map((product, index) => (
              <Reveal key={product.id} delay={Math.min(index, 7) * 45}>
                <ProductCard product={product} />
              </Reveal>
            ))}
      </div>

      {!loading && filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded border border-dashed border-ink-300 py-14 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
            <Icon name="search" size={22} />
          </span>
          <p className="text-sm font-semibold text-ink-900">No products match those filters</p>
          <p className="max-w-xs text-sm text-ink-500">
            Try a different category or clear the search to see the full catalogue.
          </p>
          <Button variant="outline" size="sm" className="mt-1" onClick={onResetFilters}>
            Reset filters
          </Button>
        </div>
      ) : null}

      {!loading && visible < filtered.length ? (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => setVisible((value) => value + PAGE_SIZE)}>
            Load more products
            <Icon name="chevronDown" size={16} />
          </Button>
        </div>
      ) : null}
    </Section>
  )
}
