import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { FEATURES } from '../../lib/features'

export function MobileNav() {
  return (
    <nav
      aria-label="Feature pages"
      className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden"
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            'flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium',
            isActive ? 'bg-firebase-blue-500/10 text-firebase-blue-700' : 'text-slate-600',
          )
        }
      >
        Overview
      </NavLink>
      {FEATURES.map((feature) => (
        <NavLink
          key={feature.id}
          to={feature.route}
          className={({ isActive }) =>
            cn(
              'flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium',
              isActive ? 'bg-firebase-blue-500/10 text-firebase-blue-700' : 'text-slate-600',
            )
          }
        >
          {feature.navLabel}
        </NavLink>
      ))}
    </nav>
  )
}
