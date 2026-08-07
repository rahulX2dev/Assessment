import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import { Rating } from '@/components/ui/Rating'
import { formatUsd, titleCase, truncate } from '@/lib/format'
import { useCart } from '../CartContext'

export function ProductCard({ product }) {
  const { addItem } = useCart()
  const [wishlisted, setWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discount = Math.round(product.price * 1.35)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded border border-ink-200 bg-white transition duration-200 hover:border-ink-300 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-ink-50 p-6">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            width="300"
            height="300"
            onLoad={() => setImageLoaded(true)}
            className={cn(
              'h-full w-full object-contain transition-all duration-500 group-hover:scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0',
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded bg-ink-100 text-ink-400">
            <Icon name="bag" size={28} />
          </div>
        )}

        <button
          type="button"
          onClick={() => setWishlisted((value) => !value)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className={cn(
            'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded border bg-white/95 transition-colors',
            wishlisted ? 'border-rose-300 text-rose-600' : 'border-ink-200 text-ink-500 hover:text-ink-800',
          )}
        >
          <Icon name="heart" size={15} className={wishlisted ? 'fill-current' : ''} />
        </button>

        <span className="absolute left-3 top-3 rounded bg-shop-accent px-2 py-0.5 text-[11px] font-bold text-white">
          -26%
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          {titleCase(product.category)}
        </p>

        <h3 className="text-sm font-semibold leading-snug text-ink-900">
          {truncate(product.title, 52)}
        </h3>

        <Rating value={product.rating?.rate ?? 0} count={product.rating?.count} />

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="font-display text-base font-bold text-ink-900">{formatUsd(product.price)}</p>
            <p className="text-xs text-ink-400 line-through">{formatUsd(discount)}</p>
          </div>

          <button
            type="button"
            onClick={() => addItem(product)}
            className="inline-flex h-9 items-center gap-1.5 rounded bg-ink-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-shop-accent"
          >
            <Icon name="plus" size={14} />
            Add
          </button>
        </div>
      </div>
    </article>
  )
}
