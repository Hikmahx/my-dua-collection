import { sanitizeAvatar } from '@/lib/avatar-utils'
import type { GuestProfile, UserState } from '@/redux/reducers/userSlice'
import type { User } from '@/data/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

const USER_KEY = 'user:v1'

const isText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

/** A user from storage, or null if it is not one. The avatar is repaired, every other field must be right. */
function sanitizeUser(value: unknown): User | null {
  if (!value || typeof value !== 'object') return null
  const user = value as Record<string, unknown>
  const validProvider = user.authProvider === 'google' || user.authProvider === 'facebook'
  if (!isText(user.id) || !isText(user.userCode) || !isText(user.firstName) || !validProvider) return null
  if (!isText(user.providerUserId) || !isText(user.createdAt) || !isText(user.updatedAt)) return null

  return {
    id: user.id,
    userCode: user.userCode,
    firstName: user.firstName,
    ...(isText(user.lastName) ? { lastName: user.lastName } : {}),
    ...(isText(user.email) ? { email: user.email } : {}),
    avatar: sanitizeAvatar(user.avatar),
    authProvider: user.authProvider as User['authProvider'],
    providerUserId: user.providerUserId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/** Keeps only valid values from whatever was saved. `currentUser: null` (signed out) is a valid value. */
export function sanitizeUserState(value: unknown): Partial<UserState> {
  if (!value || typeof value !== 'object') return {}
  const saved = value as Record<string, unknown>
  const result: Partial<UserState> = {}

  if (saved.currentUser === null) result.currentUser = null
  else {
    const user = sanitizeUser(saved.currentUser)
    if (user) result.currentUser = user
  }

  if (saved.guest && typeof saved.guest === 'object') {
    const guest = saved.guest as Record<string, unknown>
    const profile: GuestProfile = {
      firstName: isText(guest.firstName) ? guest.firstName : 'Guest',
      avatar: sanitizeAvatar(guest.avatar),
    }
    if (isText(guest.lastName)) profile.lastName = guest.lastName
    result.guest = profile
  }
  return result
}

/** The saved user state, or null if nothing was saved yet (=> the signed-in user from data.json). */
export async function loadUser(): Promise<Partial<UserState> | null> {
  try {
    const saved = await AsyncStorage.getItem(USER_KEY)
    return saved ? sanitizeUserState(JSON.parse(saved)) : null
  } catch {
    return null
  }
}

export async function saveUser(state: UserState) {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(state))
  } catch {
    // not critical: the change still applies for this session
  }
}
