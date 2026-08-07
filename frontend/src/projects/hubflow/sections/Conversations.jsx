import { cn } from '@/lib/cn'
import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import { conversation } from '../data'

const capabilities = [
  {
    icon: 'sparkles',
    title: 'Intent detection on every inbound',
    detail: 'The AI service tags each message and routes it to the right queue before an agent sees it.',
  },
  {
    icon: 'headset',
    title: 'Shared inbox with assignment',
    detail: 'Agents claim conversations, leave internal notes and hand off without losing history.',
  },
  {
    icon: 'file',
    title: 'Templates that stay approved',
    detail: 'Track Meta approval status and quality rating per template, with alerts before a number gets flagged.',
  },
]

function Bubble({ message }) {
  if (message.from === 'ai') {
    return (
      <div className="mx-auto flex max-w-[85%] items-center gap-2 rounded border border-hub-200 bg-hub-50 px-3 py-2">
        <Icon name="sparkles" size={13} className="text-hub-600" />
        <p className="font-mono text-[11px] leading-snug text-hub-700">{message.text}</p>
      </div>
    )
  }

  const outbound = message.from === 'business'

  return (
    <div className={cn('flex', outbound ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded px-3 py-2 text-sm leading-relaxed shadow-sm',
          outbound ? 'bg-emerald-600 text-white' : 'bg-white text-ink-800',
        )}
      >
        <p>{message.text}</p>
        <p className={cn('mt-1 text-right text-[10px]', outbound ? 'text-emerald-100' : 'text-ink-400')}>
          {message.time}
          {outbound ? ' ✓✓' : ''}
        </p>
      </div>
    </div>
  )
}

export function Conversations() {
  return (
    <Section className="bg-ink-950 text-white">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <Badge tone="invert">
            <Icon name="message" size={13} />
            WhatsApp Business API
          </Badge>

          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Your customers are already on WhatsApp. Meet them there properly.
          </h2>

          <p className="text-base leading-relaxed text-ink-300">
            Broadcast, transactional and conversational messaging on one official number, with the AI
            assistant sitting between the inbound stream and your agents.
          </p>

          <div className="flex flex-col gap-5">
            {capabilities.map((item) => (
              <div key={item.title} className="flex gap-3.5">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-white/15 bg-white/5 text-hub-300">
                  <Icon name={item.icon} size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100} className="mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded border border-white/15 bg-[#0d1418] shadow-lift">
            <div className="flex items-center gap-3 bg-[#1f2c33] px-4 py-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                VL
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Vidyapeeth Learning</p>
                <p className="text-[11px] text-emerald-400">online</p>
              </div>
              <Icon name="video" size={17} className="text-ink-400" />
              <Icon name="phone" size={16} className="text-ink-400" />
            </div>

            <div className="flex flex-col gap-2.5 bg-[#0b141a] px-3.5 py-5">
              {conversation.map((message, index) => (
                <Bubble key={index} message={message} />
              ))}
            </div>

            <div className="flex items-center gap-2 bg-[#1f2c33] px-3 py-2.5">
              <span className="flex-1 rounded bg-[#2a3942] px-3 py-2 text-xs text-ink-400">
                Type a message
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Icon name="send" size={14} />
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
