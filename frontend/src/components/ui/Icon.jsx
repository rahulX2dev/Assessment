import { memo } from 'react'
import { cn } from '@/lib/cn'

const paths = {
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  arrowLeft: 'M19 12H5M11 18l-6-6 6-6',
  chevronDown: 'm6 9 6 6 6-6',
  chevronRight: 'm9 6 6 6-6 6',
  chevronLeft: 'm15 6-6 6 6 6',
  check: 'm5 13 4 4L19 7',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  bag: 'M6 8h12l1 12H5L6 8ZM9 8V6a3 3 0 0 1 6 0v2',
  heart: 'M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0',
  users: 'M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 20v-1a4 4 0 0 0-3-3.8M16 4.2a3.5 3.5 0 0 1 0 6.6',
  play: 'M8 5.5v13l11-6.5-11-6.5Z',
  shield: 'M12 3 5 6v6c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6l-7-3ZM9.5 12l2 2 3.5-4',
  bolt: 'M13 3 5 14h6l-1 7 8-11h-6l1-7Z',
  chart: 'M4 20h16M8 20V11M13 20V5M18 20v-6',
  trending: 'M3 17l6-6 4 4 7-7M15 8h5v5',
  message: 'M20 12a7.5 7.5 0 0 1-11 6.6L4 20l1.5-4.6A7.5 7.5 0 1 1 20 12Z',
  mail: 'M3 6h18v12H3V6ZM3 7l9 6 9-6',
  phone: 'M8 3H5a2 2 0 0 0-2 2c0 8.3 6.7 15 15 15a2 2 0 0 0 2-2v-3l-4-2-2 2a13 13 0 0 1-6-6l2-2L8 3Z',
  calendar: 'M4 6h16v14H4V6ZM8 3v4M16 3v4M4 11h16',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z',
  cpu: 'M7 7h10v10H7V7ZM4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3',
  database: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  layers: 'm12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17l9 5 9-5',
  workflow: 'M4 4h6v6H4V4ZM14 14h6v6h-6v-6ZM10 7h4a3 3 0 0 1 3 3v4',
  sparkles: 'm12 3 1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3ZM18 16l.9 2.1L21 19l-2.1.9L18 22l-.9-2.1L15 19l2.1-.9L18 16Z',
  truck: 'M3 7h11v9H3V7ZM14 10h4l3 3v3h-7v-6ZM7 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 19ZM17.5 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z',
  refresh: 'M20 11a8 8 0 0 0-14-4L4 9M4 13a8 8 0 0 0 14 4l2-2M4 5v4h4M20 19v-4h-4',
  card: 'M3 6h18v12H3V6ZM3 10h18M7 15h4',
  lock: 'M6 11h12v9H6v-9ZM9 11V8a3 3 0 0 1 6 0v3',
  book: 'M4 5c0-1 1-1.6 3-1.6S11 4 12 5c1-1 3-1.6 5-1.6S20 4 20 5v13c0-1-1-1.6-3-1.6S13 17 12 18c-1-1-3-1.6-5-1.6S4 17 4 18V5ZM12 5v13',
  video: 'M3 7h12v10H3V7ZM15 11l6-3v8l-6-3',
  award: 'M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM8.5 13 7 21l5-2.5L17 21l-1.5-8',
  filter: 'M4 5h16l-6 7v6l-4 2v-8L4 5Z',
  code: 'm9 8-4 4 4 4M15 8l4 4-4 4',
  terminal: 'm5 8 4 4-4 4M12 16h7',
  quote: 'M9 6c-2.8 1-4.5 3.4-4.5 6.3V18h6v-6H7c0-1.9 1-3.3 3-4L9 6ZM19 6c-2.8 1-4.5 3.4-4.5 6.3V18h6v-6H17c0-1.9 1-3.3 3-4L19 6Z',
  external: 'M14 5h5v5M19 5l-8 8M17 14v5H5V7h5',
  gift: 'M3 11h18v9H3v-9ZM3 8h18v3H3V8ZM12 8v12M12 8S9.5 3 7.5 4.5 10 8 12 8ZM12 8s2.5-5 4.5-3.5S14 8 12 8Z',
  headset: 'M5 15v-3a7 7 0 0 1 14 0v3M5 14h2v5H6a1 1 0 0 1-1-1v-4ZM19 14h-2v5h1a1 1 0 0 0 1-1v-4Z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  puzzle: 'M9 4h6v2.5a1.8 1.8 0 1 1 0 3.5V13h3.5a1.8 1.8 0 1 0 3.5 0V20H4V4h5Z',
  cloud: 'M7 18a4 4 0 0 1-.4-8A6 6 0 0 1 18 10.5a3.8 3.8 0 0 1-1 7.5H7Z',
  file: 'M6 3h8l4 4v14H6V3ZM14 3v4h4',
  send: 'M21 3 3 10.5l7 3 3 7L21 3ZM10 13.5 21 3',
  eye: 'M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  grid: 'M4 4h7v7H4V4ZM13 4h7v7h-7V4ZM4 13h7v7H4v-7ZM13 13h7v7h-7v-7Z',
  flame: 'M12 22c3.9 0 6-2.5 6-5.6 0-4-4-4.9-3.2-9.4C12.5 8 11 9.6 11 12c-1-.6-1.5-1.7-1.5-3C7.4 10.6 6 13 6 16.4 6 19.5 8.1 22 12 22Z',
  scan: 'M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3M7 12h10',
  wallet: 'M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3V7ZM3 7V5h13M16 13h2',
  megaphone: 'M4 10v4h3l7 4V6l-7 4H4ZM17 9a3.5 3.5 0 0 1 0 6M7 14v5h3v-4',
}

function IconBase({ name, size = 20, className, strokeWidth = 1.7, ...rest }) {
  const d = paths[name]
  if (!d) return null

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', className)}
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}

export const Icon = memo(IconBase)

export function StarIcon({ filled = true, size = 16, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9L12 3.6Z" />
    </svg>
  )
}
