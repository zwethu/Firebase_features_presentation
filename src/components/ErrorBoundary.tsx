import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportError } from '../services/errorReportingService'

interface ErrorBoundaryProps {
  children: ReactNode
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
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-navy-950">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">
              This has been captured by StudyFlow AI's structured error logger. Crashlytics is not
              configured for web in this environment — see the Admin Dashboard for details.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-4 rounded-lg bg-firebase-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-firebase-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
