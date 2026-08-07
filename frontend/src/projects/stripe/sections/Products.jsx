import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { stripeProducts } from '../data'

function CheckoutMock() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 rounded bg-white p-4 shadow-card">
      <p className="font-display text-sm font-bold text-orange-500">CARTSY</p>
      <span className="text-[10px] text-stripe-slate">E-Mail</span>
      <span className="h-7 rounded border border-ink-200" />
      <div className="grid grid-cols-2 gap-2">
        <span className="flex h-8 items-center justify-center rounded bg-emerald-400 text-[10px] font-bold text-white">
          link
        </span>
        <span className="flex h-8 items-center justify-center rounded bg-ink-950 text-[10px] font-bold text-white">
          Pay
        </span>
      </div>
      {['Karte', 'Klarna', 'Cash App'].map((method, index) => (
        <span
          key={method}
          className={`flex h-8 items-center gap-2 rounded border px-2.5 text-[11px] ${
            index === 1 ? 'border-stripe-brand text-stripe-deep' : 'border-ink-200 text-stripe-slate'
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full border border-ink-300" />
          {method}
        </span>
      ))}
    </div>
  )
}

function BillingMock() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="rounded bg-white p-3.5 shadow-card">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-stripe-brand/10 text-stripe-brand">
            <Icon name="target" size={15} />
          </span>
          <span>
            <span className="block text-xs font-semibold text-stripe-deep">Pro Plan</span>
            <span className="block text-[10px] text-stripe-slate">Billed monthly</span>
          </span>
        </div>
        <p className="mt-3 text-[11px] font-semibold text-stripe-deep">Tokens</p>
        <p className="text-[10px] text-stripe-slate">₹0.95 per 1,000 units</p>
        <span className="mt-2.5 block h-1.5 w-full rounded-full bg-ink-100">
          <span className="block h-full w-2/3 rounded-full bg-gradient-to-r from-stripe-brand to-pink-400" />
        </span>
      </div>

      <div className="rounded bg-white p-3.5 shadow-card">
        <p className="text-[10px] text-stripe-slate">Tokens used in the last 30 days</p>
        <p className="font-display text-sm font-bold text-stripe-deep">1,800,253,247</p>
        <div className="mt-2 flex h-12 items-end gap-[3px]">
          {[30, 55, 20, 70, 45, 90, 60, 35, 80, 50, 65, 40].map((height, index) => (
            <span
              key={index}
              style={{ height: `${height}%` }}
              className="flex-1 rounded-sm bg-stripe-brand/70"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function AgentMock() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <span className="self-end rounded bg-white px-3 py-2 text-[11px] leading-snug text-stripe-deep shadow-card">
        I am refreshing my wardrobe. Can you recommend some cosy basics in size M?
      </span>
      <span className="self-start rounded bg-white px-3 py-2 text-[11px] leading-snug text-stripe-deep shadow-card">
        Absolutely. Here are a few comfy essentials that pair well:
      </span>
      <div className="mt-1 grid grid-cols-2 gap-2">
        {[
          { name: 'Deluxe Shirt', tone: 'bg-blue-500' },
          { name: 'Essential Hoodie', tone: 'bg-ink-900' },
        ].map((item) => (
          <span key={item.name} className="rounded bg-white p-2 shadow-card">
            <span className={`block h-12 rounded ${item.tone}`} />
            <span className="mt-1.5 block text-[10px] font-semibold text-stripe-deep">{item.name}</span>
            <span className="block text-[10px] text-stripe-slate">₹2,470.00</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function CardMock() {
  return (
    <div className="relative h-40 w-64 rotate-[-8deg] overflow-hidden rounded bg-gradient-to-br from-fuchsia-400 via-pink-400 to-orange-300 shadow-lift">
      <div className="absolute left-6 top-1/2 flex -translate-y-1/2 items-center gap-3">
        <span className="h-8 w-10 rounded bg-white/80" />
        <Icon name="refresh" size={18} className="text-white" />
      </div>
      <span className="absolute bottom-4 right-5 font-display text-sm font-bold italic text-white">
        VISA
      </span>
    </div>
  )
}

function GlobeMock() {
  return (
    <div className="relative flex h-40 w-full items-center justify-center">
      <div className="h-32 w-32 rounded-full border border-dashed border-stripe-brand/40" />
      <div className="absolute h-20 w-20 rounded-full bg-gradient-to-br from-indigo-300 to-violet-300 opacity-70 blur-sm" />
      <span className="absolute bottom-2 right-6 rounded bg-white px-2 py-1 text-[10px] font-semibold text-stripe-deep shadow-card">
        $619 USDB
      </span>
    </div>
  )
}

function PlatformMock() {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-ink-100 px-3 py-2">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-ink-200" />
          <span className="h-2 w-2 rounded-full bg-ink-200" />
          <span className="h-2 w-2 rounded-full bg-ink-200" />
        </span>
        <span className="ml-2 rounded bg-ink-50 px-2 py-0.5 font-mono text-[9px] text-stripe-slate">
          dashboard.zenflow.com
        </span>
      </div>

      <div className="p-3">
        <p className="text-[11px] font-semibold text-stripe-deep">Connected Accounts</p>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr className="text-[9px] text-stripe-slate">
              <th className="pb-1 font-medium">Accounts</th>
              <th className="pb-1 font-medium">Country</th>
              <th className="pb-1 text-right font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Vital Flow', 'Canada', '₹793,060.00'],
              ['Daybreak Yoga', 'United States', '₹142,690.00'],
              ['Sacred Space', 'UK', '₹118,465.00'],
              ['Harmony Flow', 'United States', '₹2,938,350.00'],
            ].map((row) => (
              <tr key={row[0]} className="border-t border-ink-50 text-[10px]">
                <td className="py-1.5 font-medium text-stripe-deep">{row[0]}</td>
                <td className="py-1.5 text-stripe-slate">{row[1]}</td>
                <td className="py-1.5 text-right text-stripe-deep">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const mocks = {
  checkout: CheckoutMock,
  billing: BillingMock,
  agent: AgentMock,
  card: CardMock,
  globe: GlobeMock,
  platform: PlatformMock,
}

function ProductCard({ product }) {
  const Mock = mocks[product.mock]

  return (
    <article className="group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded bg-white shadow-card">
      <div className="flex items-start justify-between gap-4 p-6">
        <h3 className="max-w-sm font-display text-xl font-semibold leading-snug tracking-tight text-stripe-deep">
          {product.title}
        </h3>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded bg-stripe-brand/10 text-stripe-brand transition-colors group-hover:bg-stripe-brand group-hover:text-white">
          <Icon name="external" size={14} />
        </span>
      </div>

      <div
        className={`relative mt-auto flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br p-6 ${product.surface}`}
      >
        <Mock />
      </div>
    </article>
  )
}

export function Products() {
  return (
    <section id="products" className="bg-stripe-mist py-16 sm:py-20">
      <div className="shell">
        <Reveal>
          <h2 className="max-w-3xl font-display text-[1.9rem] font-semibold leading-[1.2] tracking-tight text-stripe-deep sm:text-[2.4rem]">
            Flexible solutions for every business model.{' '}
            <span className="text-stripe-slate">
              Grow your business with a comprehensive set of payments and financial tools - designed to
              work individually or together.
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-5">
          {stripeProducts.map((product, index) => (
            <Reveal key={product.title} delay={Math.min(index, 4) * 60} className={product.span}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
