import { currentUserId, data } from '@/data'
import { useProfile } from '@/hooks/use-profile'
import { getKindredEntries, isKindred } from '@/lib/kindred'
import type { RootState } from '@/redux/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/**
 * The id the app shares as: the signed-in user, or, while there is only dummy data, the sample user
 * in data/data.json so a guest can try sharing. (REQUIRE_SIGN_IN_TO_SHARE in constants/share-config.ts
 * turns that off.)
 */
export function useSenderId(): string {
  const profile = useProfile()
  return profile.userId ?? currentUserId
}

/** The sender's kindred (A to Z), and quick checks on who is one. */
export function useKindred() {
  const senderId = useSenderId()
  const rows = useSelector((state: RootState) => state.kindred.kindred)

  return useMemo(
    () => ({
      senderId,
      entries: getKindredEntries(rows, data.users, senderId),
      isKindred: (userId: string) => isKindred(rows, senderId, userId),
    }),
    [rows, senderId],
  )
}
