import { cn } from '@/lib/cn'

const palettes = [
  'bg-hub-100 text-hub-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
]

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function Avatar({ name, size = 40, className }) {
  const palette = palettes[name.charCodeAt(0) % palettes.length]

  return (
    <span
      style={{ height: size, width: size, fontSize: size * 0.36 }}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold',
        palette,
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}

export function AvatarGroup({ names, size = 34, className }) {
  return (
    <div className={cn('flex -space-x-2', className)}>
      {names.map((name) => (
        <Avatar key={name} name={name} size={size} className="ring-2 ring-white" />
      ))}
    </div>
  )
}
