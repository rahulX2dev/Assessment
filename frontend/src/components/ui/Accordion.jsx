import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

export function Accordion({ items, defaultOpen = 0, className, tone = 'light' }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)

  return (
    <div className={cn('divide-y', tone === 'dark' ? 'divide-white/10' : 'divide-ink-200', className)}>
      {items.map((item, index) => {
        const open = openIndex === index
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                aria-expanded={open}
                className={cn(
                  'flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-semibold transition-colors',
                  tone === 'dark' ? 'text-white hover:text-hub-300' : 'text-ink-900 hover:text-hub-700',
                )}
              >
                <span>{item.question}</span>
                <Icon
                  name="chevronDown"
                  size={18}
                  className={cn('transition-transform duration-200', open && 'rotate-180')}
                />
              </button>
            </h3>
            <div
              className={cn(
                'grid transition-all duration-300 ease-out',
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    'pb-5 pr-8 text-sm leading-relaxed',
                    tone === 'dark' ? 'text-ink-300' : 'text-ink-600',
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
