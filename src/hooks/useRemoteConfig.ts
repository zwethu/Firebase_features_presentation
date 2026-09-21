import { useEffect, useState } from 'react'
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

  useEffect(() => {
    let mounted = true
    initRemoteConfig().then((result) => {
      if (!mounted) return
      setStatus(result)
      setValues(getAllRemoteConfigValues())
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  return { values, status, loading }
}
