import { LayoutDashboard } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { FEATURES } from '../../lib/features'
import { computeFeatureStatus } from '../../lib/featureStatus'
import { FeatureStatusDot } from '../lab/FeatureStatusBadge'

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-firebase-blue-600 text-white">
          <span className="text-sm font-bold">FL</span>
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight text-navy-950">Firebase Feature Lab</p>
          <p className="text-xs leading-tight text-slate-500">Interactive Firebase demos</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 pb-4" aria-label="Feature pages">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-firebase-blue-500/10 text-firebase-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-navy-950',
            )
          }
        >
          <LayoutDashboard size={16} aria-hidden="true" />
          Overview
        </NavLink>

        <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Features
        </p>
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <NavLink
              key={feature.id}
              to={feature.route}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-firebase-blue-500/10 text-firebase-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-navy-950',
                )
              }
            >
              <Icon size={16} aria-hidden="true" className="flex-shrink-0" />
              <span className="flex-1 truncate">{feature.navLabel}</span>
              <FeatureStatusDot status={computeFeatureStatus(feature.id)} />
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
