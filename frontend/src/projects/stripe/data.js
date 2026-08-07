export const stripeNav = [
  {
    label: 'Products',
    items: [
      { title: 'Payments', description: 'Online payments', icon: 'card' },
      { title: 'Billing', description: 'Subscriptions and invoicing', icon: 'refresh' },
      { title: 'Connect', description: 'Payments for platforms', icon: 'workflow' },
      { title: 'Radar', description: 'Fraud prevention', icon: 'shield' },
      { title: 'Terminal', description: 'In-person payments', icon: 'terminal' },
      { title: 'Issuing', description: 'Card creation', icon: 'wallet' },
    ],
  },
  {
    label: 'Solutions',
    items: [
      { title: 'Ecommerce', description: 'Online storefronts', icon: 'bag' },
      { title: 'SaaS', description: 'Recurring revenue', icon: 'cloud' },
      { title: 'Marketplaces', description: 'Multi-party payouts', icon: 'layers' },
      { title: 'Platforms', description: 'Embedded finance', icon: 'puzzle' },
    ],
  },
  { label: 'Developers', href: '#developers' },
  { label: 'Resources', href: '#global' },
  { label: 'Pricing', href: '#products' },
]

export const stripeLogos = [
  'OpenAI',
  'amazon',
  'NVIDIA',
  'Ford',
  'coinbase',
  'Google',
  'shopify',
  'mindbody',
  'Instacart',
  'Linear',
  'Ramp',
  'Lightspeed',
]

export const stripeProducts = [
  {
    title: 'Accept and optimise payments globally - online and in person',
    mock: 'checkout',
    span: 'lg:col-span-3',
    surface: 'from-orange-100 via-rose-100 to-amber-50',
  },
  {
    title: 'Enable any billing model',
    mock: 'billing',
    span: 'lg:col-span-2',
    surface: 'from-violet-100 via-indigo-100 to-white',
  },
  {
    title: 'Monetise through agentic commerce',
    mock: 'agent',
    span: 'lg:col-span-2',
    surface: 'from-rose-50 via-pink-100 to-white',
  },
  {
    title: 'Create a card issuing programme',
    mock: 'card',
    span: 'lg:col-span-1',
    surface: 'from-fuchsia-200 via-pink-200 to-orange-100',
  },
  {
    title: 'Access borderless money movement with stablecoins and crypto',
    mock: 'globe',
    span: 'lg:col-span-2',
    surface: 'from-indigo-100 via-violet-100 to-white',
  },
  {
    title: 'Embed payments in your platform',
    mock: 'platform',
    span: 'lg:col-span-5',
    surface: 'from-violet-200 via-indigo-100 to-white',
  },
]

export const globalStats = [
  { value: '135+', label: 'currencies and payment methods supported' },
  { value: 'US$1.9tn', label: 'in payments volume processed in 2025' },
  { value: '99.999%', label: 'historical uptime for Stripe services' },
  { value: '200m+', label: 'active subscriptions managed on Stripe Billing' },
]

export const enterpriseCases = [
  {
    company: 'URBN',
    mark: 'URBN',
    headline: 'URBN consolidates $5 billion in online and in-store revenue onto Stripe.',
  },
  {
    company: 'Instacart',
    mark: 'IC',
    headline: 'Instacart powers online grocery delivery with Stripe.',
  },
  {
    company: 'Le Monde',
    mark: 'M',
    headline: 'Le Monde improves local and international payments with Stripe.',
  },
]

export const expertServices = [
  {
    title: 'Professional services.',
    detail: 'Get tailored guidance from Stripe on implementation, complex integrations, or major migrations.',
    linkLabel: 'View services',
    icon: 'grid',
  },
  {
    title: 'Stripe-certified experts.',
    detail: 'Work with a Stripe consulting partner that can integrate and deploy Stripe solutions on your behalf.',
    linkLabel: 'View partners',
    icon: 'users',
  },
  {
    title: 'Support plans.',
    detail: 'Receive ongoing assistance and day-to-day support for technical questions with tiered plans based on your needs.',
    linkLabel: 'View plans',
    icon: 'headset',
  },
]

export const startupStories = [
  {
    name: 'Lovable',
    caption: 'Lovable grows into a vibe-coding juggernaut with Stripe.',
    surface: 'from-indigo-900 via-purple-800 to-fuchsia-700',
  },
  {
    name: 'GAMMA',
    caption: 'Gamma expands to US$100m ARR and 70 million users with Stripe.',
    surface: 'from-blue-900 via-blue-800 to-pink-600',
  },
  {
    name: 'runway',
    caption: 'Runway protects developer time with no-code solutions from Stripe.',
    surface: 'from-slate-700 via-teal-800 to-emerald-900',
  },
  {
    name: 'supabase',
    caption: 'Supabase delivers its backend service to 150 countries with Stripe.',
    surface: 'from-ink-950 via-ink-900 to-emerald-900',
  },
]

export const platformBenefits = [
  {
    title: 'Get to market faster.',
    detail: 'Launch and scale payments products with lower operational overhead using embedded components and no-code tools.',
    icon: 'send',
  },
  {
    title: 'Grow new lines of revenue.',
    detail: 'Monetise platform transactions - including payments, card interchange and financing fees.',
    icon: 'trending',
  },
  {
    title: 'Manage platform risk.',
    detail: 'Stay ahead of global regulations with tools for compliance, credit risk, fraud prevention and account security.',
    icon: 'shield',
  },
]

export const scaleStats = [
  { value: '500m+', label: 'API requests per day', gradient: 'from-orange-400 via-pink-400 to-fuchsia-400' },
  { value: '10k+', label: 'API requests per second', gradient: 'from-fuchsia-400 via-purple-400 to-violet-400' },
  { value: '150k+', label: 'transactions per minute', gradient: 'from-violet-400 via-indigo-400 to-sky-400' },
]

export const integrationPaths = [
  {
    title: 'Do not code?',
    detail:
      'Set up billing, take in-person payments, or share a payment link - right from the Stripe Dashboard, no code required.',
    linkLabel: 'Explore no-code',
    mock: 'nocode',
  },
  {
    title: 'Use a pre-integrated platform.',
    detail: 'Browse our directory of platforms that integrate Stripe with website-building tools.',
    linkLabel: 'See directory',
    mock: 'platforms',
  },
  {
    title: 'Build your own integration.',
    detail:
      'Use our SDKs, APIs, MCP server and AI developer tools to build and maintain your own integration with Stripe.',
    linkLabel: 'Get started',
    mock: 'build',
  },
]

export const newsHighlight = {
  cardTitle: 'Annual letter 2025',
  lead: 'Businesses on Stripe generated US$1.9tn in 2025.',
  detail:
    'Our annual letter explores the trends defining the internet economy - including steeper growth for newer businesses, faster international expansion, stablecoin progress, agentic commerce, and more.',
  cta: 'Read the letter',
}

export const bookOfTheWeek = {
  title: 'The Embarrassment of Riches: An Interpretation of Dutch Culture in the Golden Age',
  author: 'Simon Schama',
  blurb:
    'In the seventeenth century, the Dutch Republic - a small country that expanded its land by pumping it out of the sea - became the richest society on earth. Calvinist preachers warned that abundance would corrupt the young republic, even as merchants filled their houses with paintings and imported luxuries.',
  footnote:
    'For more ideas on economic progress and technological advancement, see our in-house publications:',
  publications: ['Stripe Press', 'Works in Progress'],
}

export const startCards = [
  {
    title: 'See what you will pay',
    detail: 'Integrated per-transaction pricing with no hidden fees.',
    linkLabel: 'Pricing details',
    icon: 'gift',
  },
  {
    title: 'Start building',
    detail: 'Get up and running with Stripe in as little as 10 minutes.',
    linkLabel: 'Integration options',
    icon: 'code',
  },
]

export const closingTestimonial = {
  brand: 'mindbody',
  quote:
    'With Stripe, we have a global technology partner to help our customers - from Canadian yoga studios to British boxing classes - keep growing and evolving in a new wellness world.',
  name: 'Kurtis Moyer,',
  role: 'Lead Product Manager of Payments, Mindbody',
  logos: ['mindbody', 'JOBBER', 'substack', 'lightspeed'],
}

export const stripeFooter = [
  [
    {
      title: 'Products and pricing',
      links: [
        'Pricing',
        'Atlas',
        'Authorization Boost',
        'Billing',
        'Capital',
        'Checkout',
        'Climate',
        'Connect',
        'Crypto',
        'Elements',
        'Financial Connections',
        'Identity',
        'Invoicing',
        'Issuing',
        'Link',
        'Payment links',
        'Payments',
        'Radar',
        'Sigma',
        'Tax',
        'Terminal',
        'Treasury',
      ],
    },
  ],
  [
    {
      title: 'Solutions',
      links: [
        'Enterprises',
        'Startups',
        'Agentic commerce',
        'Cryptocurrency',
        'E-commerce',
        'Embedded finance',
        'Finance automation',
        'Global businesses',
        'In-app payments',
        'Marketplaces',
        'Money management',
        'Platforms',
        'SaaS',
        'AI companies',
        'Creator economy',
        'Retail',
      ],
    },
    {
      title: 'Developers',
      links: [
        'Documentation',
        'API reference',
        'API status',
        'API changelog',
        'Libraries and SDKs',
        'Stripe Projects',
        'Developer blog',
      ],
    },
  ],
  [
    {
      title: 'Integrations and custom solutions',
      links: ['Stripe App Marketplace', 'Stripe Partner ecosystem', 'Professional services'],
    },
    {
      title: 'Resources',
      links: [
        'Product roadmap',
        'Guides',
        'Customer stories',
        'Blog',
        'Community',
        'Sessions annual conference',
        'Privacy and terms',
        'Licences',
        'Sitemap',
        'Cookie settings',
      ],
    },
  ],
  [
    {
      title: 'Company',
      links: ['Careers', 'Newsroom', 'Stripe Press', 'Contact sales'],
    },
    {
      title: 'Support',
      links: ['Get support', 'Managed support plans'],
    },
  ],
]
