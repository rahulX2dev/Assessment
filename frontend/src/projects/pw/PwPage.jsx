import { useEffect } from 'react'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { ExamCategories } from './sections/ExamCategories'
import { Batches } from './sections/Batches'
import { Centres } from './sections/Centres'
import { Results } from './sections/Results'
import { AppDownload } from './sections/AppDownload'
import { StudyResources } from './sections/StudyResources'
import { Testimonials } from './sections/Testimonials'
import { YoutubeChannels } from './sections/YoutubeChannels'
import { Footer } from './sections/Footer'

export default function PwPage() {
  useEffect(() => {
    document.title = 'Physics Wallah - Live batches for JEE, NEET, UPSC and more'
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <ExamCategories />
        <Batches />
        <Centres />
        <Results />
        <AppDownload />
        <StudyResources />
        <Testimonials />
        <YoutubeChannels />
      </main>
      <Footer />
    </div>
  )
}
