import { AppProviders } from './app/providers'
import { AppRouter } from './app/router'
import { useEffect } from 'react'
import { initAppCheck } from './services/appCheckService'

function App() {
  useEffect(() => {
    initAppCheck()
  }, [])

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App
