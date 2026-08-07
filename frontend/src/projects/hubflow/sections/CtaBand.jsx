import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function CtaBand() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const onSubmit = (event) => {
    event.preventDefault()

    if (!emailPattern.test(email)) {
      setStatus({ state: 'error', message: 'Enter a valid work email address.' })
      return
    }

    setStatus({ state: 'loading', message: '' })
    window.setTimeout(() => {
      setStatus({
        state: 'done',
        message: `Trial workspace queued for ${email}. Check your inbox for the verification OTP.`,
      })
      setEmail('')
    }, 700)
  }

  return (
    <section id="cta" className="relative overflow-hidden bg-hub-700 py-16 sm:py-20">
      <div
        className="grid-noise pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        aria-hidden="true"
      />

      <Reveal className="relative shell text-center">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          Start with one workflow. Keep the ones that pay for themselves.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-hub-100">
          Fourteen days on the Growth plan, every module unlocked, no card required.
        </p>

        <form onSubmit={onSubmit} className="mx-auto mt-8 flex w-full max-w-lg flex-col gap-2.5 sm:flex-row">
          <label htmlFor="cta-email" className="sr-only">
            Work email
          </label>
          <input
            id="cta-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (status.state === 'error') setStatus({ state: 'idle', message: '' })
            }}
            placeholder="you@company.com"
            className="h-12 flex-1 rounded border border-hub-400 bg-white/95 px-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-white"
          />
          <Button
            type="submit"
            variant="dark"
            size="lg"
            disabled={status.state === 'loading'}
            className="bg-ink-900 hover:bg-black"
          >
            {status.state === 'loading' ? 'Creating...' : 'Create workspace'}
            <Icon name="arrowRight" size={16} />
          </Button>
        </form>

        {status.message ? (
          <p
            role="status"
            className={`mt-4 text-sm ${status.state === 'error' ? 'text-amber-200' : 'text-hub-100'}`}
          >
            {status.message}
          </p>
        ) : null}

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-hub-200">
          <span className="flex items-center gap-1.5">
            <Icon name="shield" size={13} />
            SOC 2 aligned controls
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="database" size={13} />
            Data hosted in ap-south-1
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="lock" size={13} />
            OTP-backed sign-in
          </span>
        </p>
      </Reveal>
    </section>
  )
}
