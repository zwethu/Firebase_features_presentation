import {
  type RemoteConfig,
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
  getString,
  getValue,
} from 'firebase/remote-config'
import { app, isDemoMode, isFirebaseConfigured } from './firebase'

export const REMOTE_CONFIG_DEFAULTS = {
  quiz_cta_variant: 'A',
  ai_assistant_enabled: true,
  maintenance_message: '',
  max_upload_size_mb: 10,
} as const

let remoteConfigInstance: RemoteConfig | null = null

function getInstance(): RemoteConfig | null {
  if (!isFirebaseConfigured || !app) return null
  if (remoteConfigInstance) return remoteConfigInstance

  remoteConfigInstance = getRemoteConfig(app)
  remoteConfigInstance.defaultConfig = REMOTE_CONFIG_DEFAULTS
  // A short interval is fine for a live demo where presenters may toggle a
  // parameter and want to show a refresh. Never ship this to production.
  remoteConfigInstance.settings.minimumFetchIntervalMillis = isDemoMode ? 30_000 : 3_600_000
  return remoteConfigInstance
}

export interface RemoteConfigStatus {
  fetchedAt: Date | null
  usingDefaults: boolean
  error: string | null
}

export async function initRemoteConfig(): Promise<RemoteConfigStatus> {
  const instance = getInstance()
  if (!instance) {
    return { fetchedAt: null, usingDefaults: true, error: 'Remote Config is not configured.' }
  }
  try {
    await fetchAndActivate(instance)
    return { fetchedAt: new Date(), usingDefaults: false, error: null }
  } catch (error) {
    return {
      fetchedAt: null,
      usingDefaults: true,
      error: error instanceof Error ? error.message : 'Remote Config fetch failed.',
    }
  }
}

export function getQuizCtaVariant(): 'A' | 'B' {
  const instance = getInstance()
  if (!instance) return REMOTE_CONFIG_DEFAULTS.quiz_cta_variant
  const value = getString(instance, 'quiz_cta_variant')
  return value === 'B' ? 'B' : 'A'
}

export function getAiAssistantEnabled(): boolean {
  const instance = getInstance()
  if (!instance) return REMOTE_CONFIG_DEFAULTS.ai_assistant_enabled
  return getBoolean(instance, 'ai_assistant_enabled')
}

export function getMaintenanceMessage(): string {
  const instance = getInstance()
  if (!instance) return REMOTE_CONFIG_DEFAULTS.maintenance_message
  return getString(instance, 'maintenance_message')
}

export function getMaxUploadSizeMb(): number {
  const instance = getInstance()
  if (!instance) return REMOTE_CONFIG_DEFAULTS.max_upload_size_mb
  const value = getValue(instance, 'max_upload_size_mb').asNumber()
  return value > 0 ? value : REMOTE_CONFIG_DEFAULTS.max_upload_size_mb
}

export function getAllRemoteConfigValues() {
  return {
    quiz_cta_variant: getQuizCtaVariant(),
    ai_assistant_enabled: getAiAssistantEnabled(),
    maintenance_message: getMaintenanceMessage(),
    max_upload_size_mb: getMaxUploadSizeMb(),
  }
}
