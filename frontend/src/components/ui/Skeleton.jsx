import { cn } from '@/lib/cn'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded bg-ink-100', className)} />
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded border border-ink-200 bg-white p-4">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-2 h-8 w-full" />
    </div>
  )
}
