import { useEffect } from 'react'
import { Hero } from './sections/Hero'
import { Products } from './sections/Products'
import { Sessions } from './sections/Sessions'
import { Global } from './sections/Global'
import { Startups } from './sections/Startups'
import { ClosingQuote } from './sections/ClosingQuote'
import { Developers } from './sections/Developers'
import { Newsroom } from './sections/Newsroom'
import { CtaBand } from './sections/CtaBand'
import { Footer } from './sections/Footer'

export default function StripePage() {
  useEffect(() => {
    document.title = 'Stripe - Financial infrastructure to grow your revenue'
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <Products />
        <Sessions />
        <Global />
        <Startups />
        <ClosingQuote />
        <Developers />
        <Newsroom />
        <CtaBand />
      </main>
      <Footer />
    </div>
  )
}
