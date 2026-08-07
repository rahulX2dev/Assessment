const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatInr(value) {
  return inr.format(value)
}

export function formatUsd(value) {
  return usd.format(value)
}

export function formatCompact(value) {
  return compact.format(value)
}

export function truncate(text, limit) {
  if (typeof text !== 'string' || text.length <= limit) return text
  return `${text.slice(0, limit).trimEnd()}...`
}

export function titleCase(value) {
  return value.replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
}
