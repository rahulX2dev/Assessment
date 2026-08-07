import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-6">
      <div className="text-center">
        <p className="font-mono text-sm font-semibold text-hub-600">404</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink-900">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
          That route is not part of the assessment build. Head back to the project launcher.
        </p>
        <Button as={Link} to="/" className="mt-6">
          Back to launcher
        </Button>
      </div>
    </main>
  )
}
