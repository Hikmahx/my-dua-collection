import { signInWithProvider } from '@/lib/auth'
import { generateUniqueUserCode } from '@/lib/user-code'
import { data, type AuthProvider } from '@/data'
import {
  setUserCode,
  signedIn,
  signedOut,
  updateProfile,
  type ProfileChanges,
} from '@/redux/reducers/userSlice'
import type { RootState } from '@/redux/store'
import { useMemo } from 'react'
import { useDispatch, useStore } from 'react-redux'

/**
 * Everything the profile screens do to the user, in one place. Today each one changes the state
 * on this device; with a backend, each becomes a request here and the screens stay the same.
 */
export function useUserActions() {
  const dispatch = useDispatch()
  const store = useStore<RootState>()

  return useMemo(
    () => ({
      saveProfile: (changes: Omit<ProfileChanges, 'updatedAt'>) =>
        dispatch(updateProfile({ ...changes, updatedAt: new Date().toISOString() })),

      signIn: async (provider: AuthProvider) => {
        dispatch(signedIn(await signInWithProvider(provider)))
      },

      signOut: () => dispatch(signedOut()),

      /** Gives the signed-in user a new code. The backend will check that nobody has it. */
      resetUserCode: () => {
        const user = store.getState().user.currentUser
        if (!user) return
        const taken = (code: string) => data.users.some((other) => other.userCode === code)
        const code = generateUniqueUserCode(user.firstName, user.lastName, taken)
        dispatch(setUserCode({ code, updatedAt: new Date().toISOString() }))
      },
    }),
    [dispatch, store],
  )
}
