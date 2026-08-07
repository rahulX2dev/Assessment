export const projects = [
  {
    slug: 'hubflow',
    path: '/hubflow',
    name: 'Hubflow Automation',
    tagline: 'Landing page',
    summary:
      'Marketing site for the Hubflow SaaS - WhatsApp campaigns, CRM pipeline and AI automation, with pricing served over REST.',
    accent: '#4f46e5',
    surface: 'from-hub-600 to-hub-800',
    highlights: ['Live pricing API', 'Interactive workflow builder', 'Sticky navigation'],
  },
  {
    slug: 'ecommerce',
    path: '/ecommerce',
    name: 'E-Commerce',
    tagline: 'Home page',
    summary:
      'Storefront home page wired to a live product catalogue API with category filtering, cart state and skeleton loading.',
    accent: '#c2410c',
    surface: 'from-orange-500 to-amber-700',
    highlights: ['FakeStore REST API', 'Cart drawer + reducer', 'Optimistic filtering'],
  },
  {
    slug: 'pw',
    path: '/pw',
    name: 'Physics Wallah',
    tagline: 'Home page clone',
    summary:
      'Ed-tech home page recreation covering the course mega-menu, exam categories, batches, offline centres, results and study material.',
    accent: '#5c3fd8',
    surface: 'from-pw-600 to-pw-950',
    highlights: ['Course mega-menu', 'Offline centre network', 'Animated stat counters'],
  },
  {
    slug: 'stripe',
    path: '/stripe',
    name: 'Stripe',
    tagline: 'Landing page clone',
    summary:
      'Payments landing page recreation with the SVG ribbon hero, product bento grid, dark developer platform and the newsroom sections.',
    accent: '#635bff',
    surface: 'from-stripe-brand to-stripe-deep',
    highlights: ['SVG gradient ribbon hero', 'Product bento grid', 'Dark developer platform'],
  },
]

export function findProject(slug) {
  return projects.find((project) => project.slug === slug)
}
