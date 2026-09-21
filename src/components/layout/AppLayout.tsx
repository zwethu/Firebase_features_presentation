import { Outlet } from 'react-router-dom'
import { useDemoMode } from '../../app/DemoContext'
import { cn } from '../../lib/cn'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'

export function AppLayout() {
  const { presentationMode } = useDemoMode()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <MobileNav />
        <main className={cn('flex-1 px-4 py-6 lg:px-8', presentationMode && 'px-6 py-10 lg:px-12')}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
