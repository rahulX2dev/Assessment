import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { formatUsd, truncate } from '@/lib/format'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useCart } from '../CartContext'

const FREE_SHIPPING_THRESHOLD = 60

export function CartDrawer() {
  const { items, open, setOpen, count, subtotal, addItem, decrement, removeItem, clearCart } = useCart()

  useLockBodyScroll(open)

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-ink-950/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[65] flex h-full w-full max-w-md flex-col bg-white shadow-lift transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Icon name="bag" size={18} />
            <h2 className="text-base font-semibold text-ink-900">Your bag ({count})</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="inline-flex h-9 w-9 items-center justify-center rounded text-ink-600 hover:bg-ink-100"
          >
            <Icon name="close" size={18} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-400">
              <Icon name="bag" size={24} />
            </span>
            <p className="text-sm font-semibold text-ink-900">Your bag is empty</p>
            <p className="text-sm text-ink-500">Add something you like and it will show up here.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setOpen(false)}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-ink-200 px-5 py-3">
              <p className="text-xs text-ink-600">
                {remaining > 0 ? (
                  <>
                    Add <span className="font-semibold text-ink-900">{formatUsd(remaining)}</span> more for
                    free shipping
                  </>
                ) : (
                  <span className="font-semibold text-emerald-700">Free shipping unlocked</span>
                )}
              </p>
              <span className="mt-2 block h-1.5 overflow-hidden rounded bg-ink-100">
                <span
                  className="block h-full rounded bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="h-20 w-20 shrink-0 rounded border border-ink-200 bg-ink-50 p-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-medium leading-snug text-ink-900">
                        {truncate(item.title, 44)}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">{formatUsd(item.price)} each</p>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="inline-flex items-center rounded border border-ink-200">
                          <button
                            type="button"
                            onClick={() => decrement(item.id)}
                            aria-label={`Decrease quantity of ${item.title}`}
                            className="inline-flex h-7 w-7 items-center justify-center text-ink-600 hover:bg-ink-50"
                          >
                            <Icon name="minus" size={13} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => addItem(item)}
                            aria-label={`Increase quantity of ${item.title}`}
                            className="inline-flex h-7 w-7 items-center justify-center text-ink-600 hover:bg-ink-50"
                          >
                            <Icon name="plus" size={13} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-medium text-ink-500 underline-offset-2 hover:text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-ink-900">
                      {formatUsd(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={clearCart}
                className="mt-6 text-xs font-medium text-ink-500 underline-offset-2 hover:text-ink-800 hover:underline"
              >
                Clear bag
              </button>
            </div>

            <footer className="border-t border-ink-200 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">Subtotal</span>
                <span className="font-display text-lg font-bold text-ink-900">{formatUsd(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-500">Taxes and duties calculated at checkout.</p>
              <Button fullWidth size="lg" className="mt-4 bg-shop-accent hover:bg-orange-800">
                Checkout
                <Icon name="arrowRight" size={16} />
              </Button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
