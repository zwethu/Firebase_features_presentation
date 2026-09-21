import { Component, type ErrorInfo, type ReactNode } from 'react'
import { CRASHLYTICS_WEB_SUPPORTED, reportError } from '../services/errorReportingService'

interface ErrorBoundaryProps {
  children: ReactNode
  onCaught?: (error: Error) => void
  onReset?: () => void
  compact?: boolean
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, { componentStack: info.componentStack })
    this.props.onCaught?.(error)
  }

  handleReset = () => {
    this.props.onReset?.()
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      const shellClass = this.props.compact
        ? 'rounded-lg border border-amber-300 bg-amber-50 p-5 text-center'
        : 'flex min-h-screen items-center justify-center bg-slate-50 p-6'
      const cardClass = this.props.compact
        ? ''
        : 'max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm'

      return (
        <div className={shellClass}>
          <div className={cardClass}>
            <h1 className="text-lg font-semibold text-navy-950">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">
              React Error Boundary caught this error and the local error logger recorded it.
              {CRASHLYTICS_WEB_SUPPORTED
                ? ' Crashlytics is active in this environment.'
                : ' Crashlytics is not configured for this environment.'}
            </p>
            <p className="mt-2 font-mono text-xs text-slate-500">{this.state.error.message}</p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-4 rounded-lg bg-firebase-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-firebase-blue-700"
            >
              {this.props.compact ? 'Recover demo' : 'Try again'}
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
