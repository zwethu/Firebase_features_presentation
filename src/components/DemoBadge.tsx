import { Badge } from './ui/Badge'
import { useDemoMode } from '../app/DemoContext'

export function DemoBadge() {
  const { demoMode } = useDemoMode()
  if (!demoMode) return null
  return (
    <Badge tone="warning" title="Deterministic seeded demo data is active">
      Live Demo
    </Badge>
  )
}
