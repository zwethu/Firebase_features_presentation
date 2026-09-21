import {
  BarChart3,
  Bell,
  Bot,
  Bug,
  Database,
  FlaskConical,
  FolderUp,
  Globe,
  KeyRound,
  type LucideIcon,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from 'lucide-react'

export type FeatureId =
  | 'authentication'
  | 'firestore'
  | 'realtime-database'
  | 'storage'
  | 'functions'
  | 'ai-logic'
  | 'app-check'
  | 'notifications'
  | 'remote-config'
  | 'ab-testing'
  | 'analytics'
  | 'error-monitoring'
  | 'hosting'
  | 'updates-2026'

export interface FeatureDefinition {
  id: FeatureId
  route: string
  navLabel: string
  title: string
  tagline: string
  icon: LucideIcon
}

/**
 * Single source of truth for every Feature Lab page: its route, the label
 * shown in the sidebar, and the header copy on its own page. Sidebar,
 * Overview grid, and each feature page all read from this list so adding a
 * feature never means touching three different files' worth of strings.
 */
export const FEATURES: FeatureDefinition[] = [
  {
    id: 'authentication',
    route: '/authentication',
    navLabel: 'Authentication',
    title: 'Firebase Authentication',
    tagline: 'Who is the user?',
    icon: KeyRound,
  },
  {
    id: 'firestore',
    route: '/firestore',
    navLabel: 'Cloud Firestore',
    title: 'Cloud Firestore',
    tagline: 'A real-time, structured NoSQL database.',
    icon: Database,
  },
  {
    id: 'realtime-database',
    route: '/realtime-database',
    navLabel: 'Realtime Database',
    title: 'Realtime Database',
    tagline: 'A JSON tree synced across clients with very low latency.',
    icon: Radio,
  },
  {
    id: 'storage',
    route: '/storage',
    navLabel: 'Cloud Storage',
    title: 'Cloud Storage',
    tagline: 'Durable, secure storage for large files.',
    icon: FolderUp,
  },
  {
    id: 'functions',
    route: '/functions',
    navLabel: 'Cloud Functions',
    title: 'Cloud Functions',
    tagline: 'Backend code that runs automatically when events happen.',
    icon: Zap,
  },
  {
    id: 'ai-logic',
    route: '/ai-logic',
    navLabel: 'AI Logic + Gemini',
    title: 'Firebase AI Logic + Gemini',
    tagline: 'Generative AI, called safely from the client.',
    icon: Bot,
  },
  {
    id: 'app-check',
    route: '/app-check',
    navLabel: 'App Check',
    title: 'App Check',
    tagline: 'Does this request come from our legitimate app?',
    icon: ShieldCheck,
  },
  {
    id: 'notifications',
    route: '/notifications',
    navLabel: 'Notifications',
    title: 'Notifications',
    tagline: 'In-app, real-time — with optional push.',
    icon: Bell,
  },
  {
    id: 'remote-config',
    route: '/remote-config',
    navLabel: 'Remote Config',
    title: 'Remote Config',
    tagline: 'Change app behavior without shipping a new release.',
    icon: SlidersHorizontal,
  },
  {
    id: 'ab-testing',
    route: '/ab-testing',
    navLabel: 'A/B Testing',
    title: 'A/B Testing',
    tagline: 'Compare variants using real user behavior.',
    icon: FlaskConical,
  },
  {
    id: 'analytics',
    route: '/analytics',
    navLabel: 'Analytics',
    title: 'Google Analytics',
    tagline: 'What are users doing in the app?',
    icon: BarChart3,
  },
  {
    id: 'error-monitoring',
    route: '/error-monitoring',
    navLabel: 'Error Monitoring',
    title: 'Error Monitoring',
    tagline: 'What is failing, and how do we find out?',
    icon: Bug,
  },
  {
    id: 'hosting',
    route: '/hosting',
    navLabel: 'Hosting',
    title: 'Firebase Hosting',
    tagline: 'HTTPS, global delivery, one deploy command.',
    icon: Globe,
  },
  {
    id: 'updates-2026',
    route: '/updates-2026',
    navLabel: '2026 Updates',
    title: '2026 Platform Update',
    tagline: "What's new across the Firebase platform.",
    icon: Sparkles,
  },
]

export function getFeature(id: FeatureId): FeatureDefinition {
  const feature = FEATURES.find((f) => f.id === id)
  if (!feature) {
    throw new Error(`Unknown feature id: ${id}`)
  }
  return feature
}
