import { Icon } from '@/components/ui/Icon'
import { learningResources, pwFooter, socialLinks } from '../data'

function StoreBadge({ platform, label }) {
  return (
    <a
      href="#batches"
      className="inline-flex items-center gap-2.5 rounded bg-ink-950 px-3.5 py-2 text-white transition-colors hover:bg-black"
    >
      <Icon name={platform === 'ios' ? 'bag' : 'play'} size={19} />
      <span className="text-left">
        <span className="block text-[8px] uppercase tracking-wide text-white/70">
          {platform === 'ios' ? 'Download on the' : 'Get it on'}
        </span>
        <span className="block font-display text-xs font-bold leading-tight">{label}</span>
      </span>
    </a>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink-900">
                <span className="font-display text-xs font-bold text-ink-900">PW</span>
              </span>
              <span className="font-display text-base font-bold tracking-tight text-ink-900">
                Physics Wallah
              </span>
            </div>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600">
              We understand that every student has unique needs and abilities, that is why our
              curriculum is designed to adapt to your needs and help you grow.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <StoreBadge platform="android" label="Google Play" />
              <StoreBadge platform="ios" label="App Store" />
            </div>

            <p className="mt-6 text-sm font-semibold text-ink-900">Let us get social :</p>
            <div className="mt-2.5 flex gap-2">
              {socialLinks.map((icon) => (
                <span
                  key={icon}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pw-50 text-pw-600"
                >
                  <Icon name={icon} size={15} />
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {pwFooter.map((column) => (
              <div key={column.title}>
                <p className="font-display text-sm font-bold text-ink-900">{column.title}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#batches"
                        className="text-[13px] text-ink-600 transition-colors hover:text-pw-600"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-ink-200 bg-ink-50/60">
        <div className="shell py-12">
          <h2 className="font-display text-lg font-bold text-ink-900">Free Learning Resources</h2>

          <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {learningResources.map((group) => (
              <div key={group.title}>
                <p className="text-[13px] font-bold text-pw-600">{group.title}</p>
                <ul className="mt-2.5 flex flex-col gap-1.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#batches"
                        className="text-xs text-ink-600 transition-colors hover:text-pw-600"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-ink-200 pt-8">
            <h3 className="font-display text-base font-bold text-ink-900">
              Know about Physics Wallah
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-600">
              <span className="text-pw-600">Physics Wallah</span> is an Indian edtech platform that
              provides accessible and comprehensive learning experiences to students of Class 6th to
              postgraduate level. We also provide extensive NCERT solutions, sample papers, NEET, JEE
              Mains, BITSAT previous year papers and more such resources to students.
            </p>

            <h3 className="mt-6 font-display text-base font-bold text-ink-900">
              We Stand Out because
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-600">
              We provide students with intensive courses with highly qualified and experienced
              faculties and mentors. Our aim is to make the learning experience comprehensive and
              accessible for students of all sections of society.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-ink-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink-500">
              © {new Date().getFullYear()} Physics Wallah. Recreated as a UI exercise for the
              HubUnicon technical assessment.
            </p>
            <p className="text-xs text-ink-500">Made in India, for Indian students.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
