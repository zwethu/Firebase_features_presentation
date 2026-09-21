import { Badge } from '../ui/Badge'
import { FEATURE_STATUS_LABEL, type FeatureStatus } from '../../lib/featureStatus'

const STATUS_TONE = {
  live: 'success',
  demo: 'warning',
  optional: 'info',
  'not-configured': 'neutral',
} as const

export function FeatureStatusBadge({ status }: { status: FeatureStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{FEATURE_STATUS_LABEL[status]}</Badge>
}

export function FeatureStatusDot({ status }: { status: FeatureStatus }) {
  const color =
    status === 'live'
      ? 'bg-emerald-500'
      : status === 'demo'
        ? 'bg-amber-500'
        : status === 'optional'
          ? 'bg-firebase-blue-500'
          : 'bg-slate-300'
  return <span className={`inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${color}`} aria-hidden="true" />
}
