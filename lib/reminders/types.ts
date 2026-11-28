export type ReminderKind = 'daily' | 'countdown' | 'occasion' | 'night'

/** One notification to schedule: what it says, when it goes out, and where tapping it leads. */
export interface ReminderSpec {
  /** Stable for the same reminder (e.g. `daily-2026-11-27`), so a reschedule never makes a duplicate in the centre. */
  id: string
  kind: ReminderKind
  fireAt: Date
  title: string
  body: string
  /** The dua a daily reminder is about: tapping the notification opens it. */
  duaId?: string
}

/** A reminder as it is kept on the device (dates as text). */
export interface StoredReminder {
  id: string
  kind: ReminderKind
  fireAt: string
  title: string
  body: string
  duaId?: string
}
