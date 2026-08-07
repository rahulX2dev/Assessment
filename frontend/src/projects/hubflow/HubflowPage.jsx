import { useEffect } from 'react'
import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { LogoStrip } from './sections/LogoStrip'
import { Stats } from './sections/Stats'
import { Features } from './sections/Features'
import { Workflow } from './sections/Workflow'
import { Conversations } from './sections/Conversations'
import { Integrations } from './sections/Integrations'
import { Testimonials } from './sections/Testimonials'
import { Pricing } from './sections/Pricing'
import { Faq } from './sections/Faq'
import { CtaBand } from './sections/CtaBand'
import { Footer } from './sections/Footer'

export default function HubflowPage() {
  useEffect(() => {
    document.title = 'Hubflow Automation - WhatsApp CRM and campaign platform'
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <LogoStrip />
        <Stats />
        <Features />
        <Workflow />
        <Conversations />
        <Integrations />
        <Testimonials />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </div>
  )
}
