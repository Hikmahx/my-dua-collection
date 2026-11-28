import { loadNotifications, saveNotifications } from '@/lib/notifications-storage'
import { hydrateNotifications } from '@/redux/reducers/notificationsSlice'
import type { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Restores the notification centre and what is scheduled on launch, and saves every later change.
 * Returns true once the saved ones have been loaded.
 */
export function useNotificationsPersistence(): boolean {
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.notifications)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadNotifications().then((saved) => {
      if (!active) return
      if (saved) dispatch(hydrateNotifications(saved))
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [dispatch])

  useEffect(() => {
    if (ready) saveNotifications(notifications)
  }, [notifications, ready])

  return ready
}
