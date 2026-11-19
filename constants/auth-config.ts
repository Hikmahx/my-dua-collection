import type { AuthProvider } from '@/data/types'

export interface AuthProviderInfo {
  id: AuthProvider
  label: string
  /** A MaterialCommunityIcons name. */
  icon: 'google' | 'facebook'
}

/** The accounts a user can sign in with, in the order they are offered. */
export const AUTH_PROVIDERS: AuthProviderInfo[] = [
  { id: 'google', label: 'Google', icon: 'google' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook' },
]

export const getAuthProvider = (id: AuthProvider) => AUTH_PROVIDERS.find((provider) => provider.id === id)!

export const NAME_MAX_LENGTH = 40
