/**
 * Settings for the reminders (local notifications): when they are sent, how far ahead they are scheduled, and the
 * limits. The texts are in locales/en.ts (`reminder.*`), what is sent and when is built in lib/reminders/.
 */

/** The time of the daily reminder before the user picks one. */
export const DEFAULT_DAILY_REMINDER_TIME = { hour: 8, minute: 0 } as const

/** Special reminders are sent at one of two times (the user's local time). */
export const MORNING_TIME = { hour: 7, minute: 30 } as const
/** "This evening": before Maghrib in most places, so the night of Laylatul Qadr or a fast to plan for is still ahead. */
export const EVENING_TIME = { hour: 17, minute: 0 } as const

/** The daily reminder is scheduled this many days ahead, each day with its own dua, and topped up whenever the app opens. */
export const DAILY_WINDOW_DAYS = 14

/** Special reminders are scheduled this far ahead. It must reach the 100 days before Ramadan. */
export const SPECIAL_HORIZON_DAYS = 130

/** iOS keeps at most 64 pending notifications, so the schedule never holds more than this (the nearest ones win). */
export const MAX_SCHEDULED = 60

/** The notification centre keeps this many (the oldest are dropped). */
export const MAX_CENTRE_ITEMS = 100

/** Android notification channels (the user can change each in the phone's settings). */
export const CHANNEL_DAILY = 'daily'
export const CHANNEL_SPECIAL = 'special'

/** The Android channel names in the phone's settings (not translated: they are shown by Android, not the app). */
export const CHANNEL_NAMES = { daily: 'Daily dua', special: 'Special days' } as const
