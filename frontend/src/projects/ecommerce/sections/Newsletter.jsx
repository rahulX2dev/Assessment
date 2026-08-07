import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const onSubmit = (event) => {
    event.preventDefault()

    if (!emailPattern.test(email)) {
      setStatus({ state: 'error', message: 'That email does not look right.' })
      return
    }

    setStatus({ state: 'done', message: 'You are on the list. Your 10% code is on its way.' })
    setEmail('')
  }

  return (
    <section className="bg-shop-soft py-14">
      <Reveal className="shell flex flex-col items-center gap-5 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded bg-white text-shop-accent shadow-ring">
          <Icon name="mail" size={21} />
        </span>

        <h2 className="max-w-lg font-display text-2xl font-bold tracking-tight text-shop-deep sm:text-3xl">
          Get 10% off your first order
        </h2>
        <p className="max-w-md text-sm text-ink-600">
          One email a week with new drops and restocks. Unsubscribe in a single click.
        </p>

        <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (status.state === 'error') setStatus({ state: 'idle', message: '' })
            }}
            placeholder="Enter your email"
            className="h-12 flex-1 rounded border border-ink-300 bg-white px-4 text-sm placeholder:text-ink-400 focus:border-shop-accent"
          />
          <Button type="submit" size="lg" className="bg-shop-deep hover:bg-black">
            Subscribe
          </Button>
        </form>

        {status.message ? (
          <p
            role="status"
            className={`text-sm ${status.state === 'error' ? 'text-red-600' : 'text-emerald-700'}`}
          >
            {status.message}
          </p>
        ) : null}
      </Reveal>
    </section>
  )
}
