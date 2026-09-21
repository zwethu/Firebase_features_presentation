import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { DemoProvider } from './DemoContext'
import { DemoIdentityProvider } from './DemoIdentityContext'
import { ErrorBoundary } from '../components/ErrorBoundary'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DemoProvider>
          <AuthProvider>
            <DemoIdentityProvider>{children}</DemoIdentityProvider>
          </AuthProvider>
        </DemoProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
