import { getProfile } from '@/lib/profile-utils'
import type { RootState } from '@/redux/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/** Who the app is showing: the signed-in user, or the guest on this device. */
export function useProfile() {
  const user = useSelector((state: RootState) => state.user)
  return useMemo(() => getProfile(user), [user])
}
