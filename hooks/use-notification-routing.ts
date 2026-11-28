import { duaRoute } from '@/lib/reminders/open-dua'
import { notificationRead, remindersDelivered } from '@/redux/reducers/notificationsSlice'
import type { RootState } from '@/redux/store'
import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface ReminderData {
  reminderId?: string
  kind?: string
  duaId?: string
}

/**
 * What happens when the user taps a notification (also when that is what opened the app): the reminder is marked
 * read, and the app opens its dua (the daily reminder) or the notification centre (the special reminders). Mount it
 * once in the root layout when the app is ready (the screens must exist before it navigates).
 */
export function useNotificationRouting(enabled: boolean) {
  const router = useRouter()
  const dispatch = useDispatch()
  const duas = useSelector((state: RootState) => state.duas.items)
  const response = Notifications.useLastNotificationResponse()
  const handled = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled || !response) return
    if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return

    const { identifier, content } = response.notification.request
    const key = `${identifier}:${response.notification.date}`
    if (handled.current === key) return // each tap is handled once, however often this runs
    handled.current = key

    const data = content.data as ReminderData
    // the reminder that was tapped has been sent, so it belongs in the centre (when the app was closed this is what puts it there)
    dispatch(remindersDelivered(new Date().toISOString()))
    if (data.reminderId) dispatch(notificationRead(data.reminderId))

    try {
      const dua = data.duaId ? duas.find((entry) => entry.id === data.duaId) : undefined
      if (dua) router.push(duaRoute(dua))
      else router.push('/notifications')
    } catch {
      // the screen could not be opened: the notification is still in the centre
    }
    Notifications.clearLastNotificationResponse()
  }, [enabled, response, duas, dispatch, router])
}
