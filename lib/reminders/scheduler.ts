import { CHANNEL_DAILY, CHANNEL_SPECIAL } from '@/constants/reminder-config'
import type { ReminderSpec } from '@/lib/reminders/types'
import * as Notifications from 'expo-notifications'
import { Linking, Platform } from 'react-native'

/**
 * The only file that talks to expo-notifications. Everything here is a local notification: it is scheduled on the
 * phone, works offline, and needs no server.
 */

export interface PermissionState {
  status: 'granted' | 'denied' | 'undetermined'
  /** False when the user said no and the system will not ask again: the only way left is the phone's settings. */
  canAskAgain: boolean
}

const toState = (permission: Notifications.NotificationPermissionsStatus): PermissionState => ({
  status: permission.granted
    ? 'granted'
    : permission.status === Notifications.PermissionStatus.UNDETERMINED
      ? 'undetermined'
      : 'denied',
  canAskAgain: permission.canAskAgain,
})

let configured = false

/**
 * Call once when the app starts: says that a notification that arrives while the app is open is still shown, and
 * creates the two Android channels (a channel must exist before the first notification and before Android 13 asks
 * for permission). Safe to call again.
 */
export async function setUpNotifications(channelNames: { daily: string; special: string }): Promise<void> {
  if (configured) return
  configured = true
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  })
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_DAILY, {
      name: channelNames.daily,
      importance: Notifications.AndroidImportance.DEFAULT,
    })
    await Notifications.setNotificationChannelAsync(CHANNEL_SPECIAL, {
      name: channelNames.special,
      importance: Notifications.AndroidImportance.HIGH,
    })
  }
}

export async function getPermission(): Promise<PermissionState> {
  try {
    return toState(await Notifications.getPermissionsAsync())
  } catch {
    return { status: 'denied', canAskAgain: false }
  }
}

/** Shows the system's own permission question. */
export async function requestPermission(): Promise<PermissionState> {
  try {
    return toState(await Notifications.requestPermissionsAsync())
  } catch {
    return { status: 'denied', canAskAgain: false }
  }
}

/** The phone's settings for this app, where notifications can be turned on after a "no". */
export const openNotificationSettings = () => Linking.openSettings()

// Scheduling cancels everything and schedules again, so two runs at once would mix. They run one after the other.
let queue: Promise<unknown> = Promise.resolve()

/** Makes the phone's scheduled notifications exactly `specs`: everything scheduled before is removed. */
export function replaceScheduledReminders(specs: readonly ReminderSpec[]): Promise<void> {
  const run = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync()
    for (const spec of specs) {
      await Notifications.scheduleNotificationAsync({
        identifier: spec.id,
        content: {
          title: spec.title,
          body: spec.body,
          sound: 'default',
          data: { reminderId: spec.id, kind: spec.kind, ...(spec.duaId ? { duaId: spec.duaId } : {}) },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: spec.fireAt,
          channelId: spec.kind === 'daily' ? CHANNEL_DAILY : CHANNEL_SPECIAL,
        },
      })
    }
  }
  const next = queue.then(run, run)
  queue = next.catch(() => undefined)
  return next
}

/** A notification a few seconds from now, to see that reminders work on this phone. */
export async function scheduleTestNotification(title: string, body: string, seconds = 4): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default', data: { kind: 'test' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, channelId: CHANNEL_SPECIAL },
  })
}
