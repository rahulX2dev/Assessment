import { Icon } from '@/components/ui/Icon'
import { footerLinks } from '../data'

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white py-14">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-hub-600 text-white">
                <Icon name="bolt" size={17} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-ink-900">Hubflow</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600">
              Conversation-led automation for revenue teams. Campaigns, CRM, AI and billing in one
              workspace.
            </p>
            <div className="mt-5 flex gap-2">
              {['globe', 'message', 'mail'].map((icon) => (
                <span
                  key={icon}
                  className="inline-flex h-9 w-9 items-center justify-center rounded border border-ink-200 text-ink-500"
                >
                  <Icon name={icon} size={16} />
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-semibold text-ink-900">{group.title}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#features" className="text-sm text-ink-600 transition-colors hover:text-ink-900">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} Hubflow Automation. Built for the HubUnicon technical assessment.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  )
}
