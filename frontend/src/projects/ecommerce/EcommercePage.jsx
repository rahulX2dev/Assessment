import { useEffect, useState } from 'react'
import { CartProvider } from './CartContext'
import { CartDrawer } from './components/CartDrawer'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Categories } from './sections/Categories'
import { DealStrip } from './sections/DealStrip'
import { ProductGrid } from './sections/ProductGrid'
import { Promo } from './sections/Promo'
import { Reviews } from './sections/Reviews'
import { Newsletter } from './sections/Newsletter'
import { Footer } from './sections/Footer'

export default function EcommercePage() {
  const [category, setCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    document.title = 'Kanvas - Everyday essentials, priced honestly'
  }, [])

  const resetFilters = () => {
    setCategory('all')
    setSearchTerm('')
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header searchTerm={searchTerm} onSearch={setSearchTerm} />
        <main>
          <Hero />
          <Categories activeCategory={category} onSelect={setCategory} />
          <DealStrip />
          <ProductGrid category={category} searchTerm={searchTerm} onResetFilters={resetFilters} />
          <Promo />
          <Reviews />
          <Newsletter />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
