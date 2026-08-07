import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Badge } from '@/components/ui/Badge'

export function Hero() {
  return (
    <section className="border-b border-ink-100 bg-shop-soft">
      <div className="shell grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <Reveal className="flex flex-col items-start gap-5">
          <Badge tone="warning">
            <Icon name="flame" size={13} />
            End of season sale is live
          </Badge>

          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-shop-deep sm:text-5xl lg:text-[3.5rem]">
            Everyday essentials,
            <br />
            priced honestly.
          </h1>

          <p className="max-w-md text-base leading-relaxed text-ink-600">
            Fresh drops across clothing, electronics and jewellery. Free delivery over ₹1,499 and a
            30-day return window on everything.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as="a" href="#products" size="lg" className="bg-shop-accent hover:bg-orange-800">
              Shop new arrivals
              <Icon name="arrowRight" size={16} />
            </Button>
            <Button as="a" href="#deal" variant="light" size="lg">
              View today's deals
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            {[
              { icon: 'truck', label: 'Delivery in 2-4 days' },
              { icon: 'refresh', label: '30-day returns' },
              { icon: 'shield', label: 'Secure payments' },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5 text-sm text-ink-600">
                <Icon name={item.icon} size={15} className="text-shop-accent" />
                {item.label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="col-span-2 flex items-end justify-between rounded bg-shop-deep p-6 text-white sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Featured</p>
              <p className="mt-2 font-display text-2xl font-bold">Monsoon layers</p>
              <p className="mt-1 text-sm text-white/70">Up to 45% off outerwear</p>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded border border-white/20">
              <Icon name="arrowUpRight" size={20} />
            </span>
          </div>

          <div className="rounded border border-ink-200 bg-white p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-ink-50 text-ink-700">
              <Icon name="cpu" size={19} />
            </span>
            <p className="mt-3 font-display text-lg font-bold text-ink-900">Tech week</p>
            <p className="mt-1 text-sm text-ink-600">Audio from ₹1,299</p>
          </div>

          <div className="rounded border border-ink-200 bg-white p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-ink-50 text-ink-700">
              <Icon name="gift" size={19} />
            </span>
            <p className="mt-3 font-display text-lg font-bold text-ink-900">Gift cards</p>
            <p className="mt-1 text-sm text-ink-600">Delivered instantly</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
