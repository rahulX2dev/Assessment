import { Icon } from '@/components/ui/Icon'
import { footerColumns } from '../data'

const payments = ['UPI', 'Visa', 'Mastercard', 'RuPay', 'Net Banking', 'EMI']

export function Footer() {
  return (
    <footer className="bg-shop-deep py-14 text-white">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2.4fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-shop-accent">
                <Icon name="bag" size={16} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">Kanvas</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Everyday essentials for people who would rather not think about shopping.
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {payments.map((method) => (
                <span
                  key={method}
                  className="rounded border border-white/15 px-2 py-1 text-[11px] text-white/60"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold">{column.title}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#products" className="text-sm text-white/60 transition-colors hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Kanvas Retail. Catalogue data from the FakeStore public API.
          </p>
          <div className="flex gap-2">
            {['globe', 'message', 'mail'].map((icon) => (
              <span
                key={icon}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-white/15 text-white/60"
              >
                <Icon name={icon} size={15} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
