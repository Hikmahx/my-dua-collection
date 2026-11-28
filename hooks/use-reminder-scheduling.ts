import { CHANNEL_NAMES } from '@/constants/reminder-config'
import { useT } from '@/hooks/use-t'
import { useToday } from '@/hooks/use-today'
import { getTranslation } from '@/lib/dua-utils'
import { buildReminders } from '@/lib/reminders/build-reminders'
import { getPermission, replaceScheduledReminders, setUpNotifications } from '@/lib/reminders/scheduler'
import type { StoredReminder } from '@/lib/reminders/types'
import { remindersDelivered, remindersScheduled } from '@/redux/reducers/notificationsSlice'
import type { RootState } from '@/redux/store'
import * as Notifications from 'expo-notifications'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { AppState } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const DEBOUNCE_MS = 500

/**
 * Keeps the phone's scheduled reminders right. Mount it once, in the root layout, when the app is ready. It
 * schedules again (everything is replaced, nothing is added to) when:
 * - the app opens or comes back to the front (the daily reminders are always scheduled two weeks ahead, so this
 *   tops them up, and the special reminders come in as their date gets near),
 * - the day changes while the app is open,
 * - a setting changes: the daily reminder or its time, the special reminders, the Hijri date adjustment, the
 *   language, or the duas (the daily reminder is about a dua),
 * - the permission is allowed or taken away (when the app comes back from the phone's settings).
 * Before it replaces the schedule it moves the reminders that have been sent into the notification centre.
 */
export function useReminderScheduling(enabled: boolean) {
  const dispatch = useDispatch()
  const t = useT()
  const day = useToday()
  const settings = useSelector((state: RootState) => state.settings)
  const duas = useSelector((state: RootState) => state.duas.items)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { dailyReminder, dailyReminderTime, monthlyReminders, hijriAdjustment, translationLanguage } = settings

  // only what the daily reminder shows of a dua, and only worked out when the duas or the language change
  const reminderDuas = useMemo(
    () => duas.map((dua) => ({ id: dua.id, title: dua.title, translation: getTranslation(dua, translationLanguage) })),
    [duas, translationLanguage],
  )

  const reschedule = useCallback(async () => {
    try {
      await setUpNotifications(CHANNEL_NAMES)
      const now = new Date()
      // what was sent since the last time goes into the notification centre first
      dispatch(remindersDelivered(now.toISOString()))

      const permission = await getPermission()
      const specs =
        permission.status === 'granted'
          ? buildReminders({
              now,
              settings: {
                dailyReminder,
                dailyTime: dailyReminderTime,
                specialReminders: monthlyReminders,
                hijriAdjustment,
              },
              duas: reminderDuas,
              t,
            })
          : []

      await replaceScheduledReminders(specs)
      const stored: StoredReminder[] = specs.map((spec) => ({
        id: spec.id,
        kind: spec.kind,
        fireAt: spec.fireAt.toISOString(),
        title: spec.title,
        body: spec.body,
        ...(spec.duaId ? { duaId: spec.duaId } : {}),
      }))
      dispatch(remindersScheduled(stored))
    } catch {
      // scheduling is best effort: the settings are kept and it is tried again the next time
    }
  }, [dispatch, dailyReminder, dailyReminderTime, monthlyReminders, hijriAdjustment, reminderDuas, t])

  const schedule = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(reschedule, DEBOUNCE_MS)
  }, [reschedule])

  // a setting changed, the day changed, or the app just started
  useEffect(() => {
    if (enabled) schedule()
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [enabled, schedule, day])

  // back in the app (also after the phone's settings, where notifications may have been allowed)
  useEffect(() => {
    if (!enabled) return
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') schedule()
    })
    return () => subscription.remove()
  }, [enabled, schedule])

  // a notification that arrives while the app is open goes into the centre at once
  useEffect(() => {
    if (!enabled) return
    const subscription = Notifications.addNotificationReceivedListener(() => {
      dispatch(remindersDelivered(new Date().toISOString()))
    })
    return () => subscription.remove()
  }, [enabled, dispatch])
}
