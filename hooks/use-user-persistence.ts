import { loadUser, saveUser } from '@/lib/user-storage'
import { hydrateUser } from '@/redux/reducers/userSlice'
import type { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const SAVE_DELAY_MS = 400

/**
 * Restores the saved user (who is signed in, their name and avatar, or the guest profile) on
 * launch, and saves every later change. Returns true once the saved user has been loaded.
 */
export function useUserPersistence(): boolean {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadUser().then((saved) => {
      if (!active) return
      if (saved) dispatch(hydrateUser(saved))
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [dispatch])

  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => saveUser(user), SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [user, ready])

  return ready
}
