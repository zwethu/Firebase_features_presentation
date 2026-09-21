import type { User } from 'firebase/auth'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { subscribeToAuthChanges } from '../services/authService'
import { subscribeToUserProfile } from '../services/firestoreService'
import { isFirebaseConfigured } from '../services/firebase'
import type { UserProfile } from '../types/models'

interface AuthContextValue {
  firebaseUser: User | null
  profile: UserProfile | null
  loading: boolean
  firebaseConfigured: boolean
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  profile: null,
  loading: true,
  firebaseConfigured: isFirebaseConfigured,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      setFirebaseUser(user)
      if (!user) {
        setProfile(null)
        setLoading(false)
      }
    })
    return unsubscribeAuth
  }, [])

  useEffect(() => {
    if (!firebaseUser) return
    setLoading(true)
    const unsubscribeProfile = subscribeToUserProfile(firebaseUser.uid, (nextProfile) => {
      setProfile(nextProfile)
      setLoading(false)
    })
    return unsubscribeProfile
  }, [firebaseUser])

  return (
    <AuthContext.Provider
      value={{ firebaseUser, profile, loading, firebaseConfigured: isFirebaseConfigured }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
