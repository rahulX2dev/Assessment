import { Icon } from '@/components/ui/Icon'
import { stripeFooter } from '../data'

export function Footer() {
  return (
    <footer className="bg-stripe-mist pb-12 pt-4">
      <div className="shell">
        <div className="grid gap-x-8 gap-y-10 border-t border-ink-200 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {stripeFooter.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className={`flex flex-col gap-10 ${
                columnIndex > 0 ? 'lg:border-l lg:border-ink-200 lg:pl-8' : ''
              }`}
            >
              {column.map((group) => (
                <div key={group.title}>
                  <p className="font-display text-base font-semibold text-stripe-deep">{group.title}</p>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#products"
                          className="text-[15px] text-stripe-slate transition-colors hover:text-stripe-brand"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href="#products"
              className="inline-flex items-center gap-2 text-[15px] font-medium text-stripe-brand hover:underline"
            >
              <Icon name="globe" size={16} />
              India (English)
            </a>
            <p className="mt-3 text-[15px] text-stripe-deep">© {new Date().getFullYear()} Stripe, LLC.</p>
            <p className="mt-1 text-xs text-stripe-slate">
              Interface recreation for the HubUnicon technical assessment, not affiliated with Stripe.
            </p>
          </div>

          <a
            href="#cta"
            className="inline-flex items-center gap-1 self-start text-[15px] font-semibold text-stripe-brand hover:underline"
          >
            Sign in
            <Icon name="chevronRight" size={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}
