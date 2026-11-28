import { useNotificationPermission } from '@/components/notifications/notification-permission-provider'
import { setDailyReminder, setDailyReminderTime, setMonthlyReminders } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The reminder toggles and the daily time, for the Settings section and the Notification preferences screen. Turning a
 * reminder on first makes sure notifications are allowed (see NotificationPermissionProvider): if they are not and the
 * user says no, the toggle stays off. A toggle shows as off while notifications are not allowed, even when the saved
 * choice is "on" (the default), because then nothing would be sent.
 */
export function useReminderSettings() {
  const dispatch = useDispatch()
  const { permission, ensure } = useNotificationPermission()
  const { dailyReminder, dailyReminderTime, monthlyReminders } = useSelector((state: RootState) => state.settings)

  // until the permission has been read, show what was saved
  const allowed = permission === null ? true : permission.status === 'granted'

  const turn = (set: (on: boolean) => { type: string; payload: boolean }) => async (on: boolean) => {
    if (on && !(await ensure())) return
    dispatch(set(on))
  }

  return {
    /** Notifications are allowed (true until the permission has been read). */
    allowed,
    dailyOn: dailyReminder && allowed,
    specialOn: monthlyReminders && allowed,
    dailyTime: dailyReminderTime,
    toggleDaily: turn(setDailyReminder),
    toggleSpecial: turn(setMonthlyReminders),
    setDailyTime: (time: { hour: number; minute: number }) => dispatch(setDailyReminderTime(time)),
  }
}
