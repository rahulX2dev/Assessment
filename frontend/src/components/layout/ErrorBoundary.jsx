import { Component } from 'react'
import { Button } from '@/components/ui/Button'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('Render failure', error, info)
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6">
          <div className="w-full max-w-md rounded border border-ink-200 bg-white p-8 text-center shadow-card">
            <h1 className="font-display text-xl font-bold text-ink-900">Something broke on this screen</h1>
            <p className="mt-2 text-sm text-ink-600">
              The page hit an unexpected error. Reloading usually clears it.
            </p>
            <Button className="mt-6" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
