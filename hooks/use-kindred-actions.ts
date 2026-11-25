import { data, type KindredGroup, type ShareTarget } from '@/data'
import { useSenderId } from '@/hooks/use-kindred'
import { buildShares, createLookupLimiter, findUserByCode, type CodeLookup, type SentShares } from '@/lib/kindred'
import { kindredAdded, sharesSent } from '@/redux/reducers/kindredSlice'
import type { RootState } from '@/redux/store'
import { useMemo } from 'react'
import { useDispatch, useStore } from 'react-redux'

// One limiter for the app: the backend counts lookups per user, not per screen.
const allowLookup = createLookupLimiter()

/**
 * Everything the share sheet does to kindred and shares, in one place (like useUserActions). Today
 * each one changes the state on this device; with a backend, each becomes a request here and the
 * screens stay the same.
 */
export function useKindredActions() {
  const dispatch = useDispatch()
  const store = useStore<RootState>()
  const senderId = useSenderId()

  return useMemo(
    () => ({
      /** Looks a user up by the code the other person told them. */
      lookUpUserByCode: async (input: string): Promise<CodeLookup> => {
        const result = findUserByCode(data.users, input, senderId)
        // text that cannot be a code, and the user's own code, never reach the backend, so they do not count
        if (result.status === 'invalid' || result.status === 'self') return result
        return allowLookup() ? result : { status: 'rateLimited' }
      },

      /** "Save as kindred?" answered yes. */
      addKindred: (kindredId: string, groups: KindredGroup[] = []) =>
        dispatch(kindredAdded({ userId: senderId, kindredId, groups, createdAt: new Date().toISOString() })),

      /** Sends the dua or collection: one pending share per person. */
      sendShares: (target: { type: ShareTarget; id: string }, recipientIds: string[]): SentShares => {
        const result = buildShares(target, senderId, recipientIds, store.getState().kindred.shares, new Date().toISOString())
        if (result.created.length > 0) dispatch(sharesSent(result.created))
        return result
      },
    }),
    [dispatch, store, senderId],
  )
}
