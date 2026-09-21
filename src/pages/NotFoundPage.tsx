import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-firebase-blue-600">404</p>
      <h1 className="text-2xl font-semibold text-navy-950">Page not found</h1>
      <p className="max-w-sm text-sm text-slate-600">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/">
        <Button className="mt-2">Back to home</Button>
      </Link>
    </div>
  )
}
