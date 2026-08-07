export const announcements = [
  'Free shipping on orders above ₹1,499',
  'Extra 10% off with code HUBUNI10',
  'Easy 30-day returns, no questions asked',
]

export const primaryNav = [
  { label: 'New In', href: '#products' },
  { label: 'Men', href: '#products' },
  { label: 'Women', href: '#products' },
  { label: 'Electronics', href: '#products' },
  { label: 'Jewellery', href: '#products' },
  { label: 'Sale', href: '#deal', accent: true },
]

export const categoryTiles = [
  { id: "men's clothing", label: 'Men', caption: '420+ styles', icon: 'user' },
  { id: "women's clothing", label: 'Women', caption: '610+ styles', icon: 'heart' },
  { id: 'electronics', label: 'Electronics', caption: '180+ products', icon: 'cpu' },
  { id: 'jewelery', label: 'Jewellery', caption: '95+ pieces', icon: 'sparkles' },
]

export const valueProps = [
  { icon: 'truck', title: 'Free delivery', detail: 'On every order above ₹1,499' },
  { icon: 'refresh', title: '30-day returns', detail: 'Pickup scheduled from your door' },
  { icon: 'shield', title: 'Secure checkout', detail: 'UPI, cards and net banking' },
  { icon: 'headset', title: 'Support till 9 PM', detail: 'Real humans, seven days a week' },
]

export const promoCards = [
  {
    eyebrow: 'Season drop',
    title: 'Monsoon layers, up to 45% off',
    detail: 'Water-resistant jackets, quick-dry tees and everyday shoes.',
    tone: 'bg-shop-deep text-white',
    action: 'Shop the edit',
  },
  {
    eyebrow: 'Tech week',
    title: 'Audio and wearables from ₹1,299',
    detail: 'Certified refurbished options with a 12-month warranty.',
    tone: 'bg-shop-soft text-shop-deep',
    action: 'Browse electronics',
  },
]

export const brandStrip = [
  'Aurelia',
  'Northbay',
  'Kanvas',
  'Studio Nine',
  'Elm & Oak',
  'Vireo',
  'Halcyon',
]

export const shopTestimonials = [
  {
    quote: 'Ordered on Friday night, wore it to a wedding on Sunday. Sizing chart was actually accurate.',
    name: 'Meera J.',
    location: 'Pune',
    rating: 5,
  },
  {
    quote: 'Return pickup happened next morning. Refund hit my account before the courier scanned it in.',
    name: 'Karthik R.',
    location: 'Chennai',
    rating: 5,
  },
  {
    quote: 'The refurbished headphones look untouched. Warranty card came in the box as promised.',
    name: 'Ishan D.',
    location: 'Indore',
    rating: 4,
  },
]

export const footerColumns = [
  { title: 'Shop', links: ['New arrivals', 'Best sellers', 'Men', 'Women', 'Electronics', 'Gift cards'] },
  { title: 'Help', links: ['Track order', 'Shipping', 'Returns & refunds', 'Size guide', 'Contact us'] },
  { title: 'Company', links: ['About us', 'Careers', 'Sustainability', 'Store locator', 'Press'] },
  { title: 'Policies', links: ['Privacy', 'Terms of use', 'Cancellation', 'Grievance officer'] },
]

export const fallbackProducts = [
  {
    id: 1,
    title: 'Ribbed cotton crew tee',
    price: 24.99,
    category: "men's clothing",
    description: 'Mid-weight combed cotton with a clean ribbed collar that holds its shape after washes.',
    image: '',
    rating: { rate: 4.4, count: 218 },
  },
  {
    id: 2,
    title: 'Everyday canvas tote',
    price: 32.5,
    category: "women's clothing",
    description: 'Structured 16oz canvas with an interior zip pocket and reinforced handles.',
    image: '',
    rating: { rate: 4.6, count: 143 },
  },
  {
    id: 3,
    title: 'Wireless over-ear headphones',
    price: 89.0,
    category: 'electronics',
    description: 'Adaptive noise cancelling, 38-hour battery and multipoint pairing.',
    image: '',
    rating: { rate: 4.5, count: 502 },
  },
  {
    id: 4,
    title: 'Brushed steel chain bracelet',
    price: 58.0,
    category: 'jewelery',
    description: 'Hypoallergenic 316L stainless steel with a fold-over clasp.',
    image: '',
    rating: { rate: 4.2, count: 87 },
  },
]
