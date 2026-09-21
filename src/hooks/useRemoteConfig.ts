import { useCallback, useEffect, useState } from 'react'
import {
  getAllRemoteConfigValues,
  initRemoteConfig,
  type RemoteConfigStatus,
} from '../services/remoteConfigService'

export function useRemoteConfig() {
  const [values, setValues] = useState(getAllRemoteConfigValues())
  const [status, setStatus] = useState<RemoteConfigStatus>({
    fetchedAt: null,
    usingDefaults: true,
    error: null,
  })
  const [loading, setLoading] = useState(true)

  const applyResult = useCallback((result: RemoteConfigStatus) => {
    setStatus(result)
    setValues(getAllRemoteConfigValues())
    setLoading(false)
  }, [])

  useEffect(() => {
    let mounted = true
    initRemoteConfig().then((result) => {
      if (!mounted) return
      applyResult(result)
    })
    return () => {
      mounted = false
    }
  }, [applyResult])

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await initRemoteConfig()
    applyResult(result)
    return result
  }, [applyResult])

  return { values, status, loading, refetch }
}
