import { MAX_CENTRE_ITEMS } from '@/constants/reminder-config'
import type { ReminderKind, StoredReminder } from '@/lib/reminders/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/** One entry of the notification centre: a reminder that has been sent. */
export interface NotificationItem {
  /** The reminder's id, so the same reminder is never listed twice. */
  id: string
  kind: ReminderKind
  title: string
  body: string
  /** When it was sent (ISO date). */
  createdAt: string
  read: boolean
  /** Tapping the item opens this dua. */
  duaId?: string
}

export interface NotificationsState {
  /** The notification centre, newest first. */
  items: NotificationItem[]
  /** What is scheduled on the phone right now (see lib/reminders/). When one of them is due it moves into `items`. */
  schedule: StoredReminder[]
}

const initialState: NotificationsState = { items: [], schedule: [] }

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /** Remembers what was just scheduled. */
    remindersScheduled(state, action: PayloadAction<StoredReminder[]>) {
      state.schedule = action.payload
    },
    /**
     * Moves the scheduled reminders that are due (their time has come) into the notification centre as unread.
     * Called when the app opens or comes to the front, and when a notification arrives while the app is open.
     */
    remindersDelivered(state, action: PayloadAction<string>) {
      const now = action.payload
      const due = state.schedule.filter((reminder) => reminder.fireAt <= now)
      if (due.length === 0) return
      state.schedule = state.schedule.filter((reminder) => reminder.fireAt > now)

      for (const reminder of due) {
        if (state.items.some((item) => item.id === reminder.id)) continue
        state.items.push({
          id: reminder.id,
          kind: reminder.kind,
          title: reminder.title,
          body: reminder.body,
          createdAt: reminder.fireAt,
          read: false,
          ...(reminder.duaId ? { duaId: reminder.duaId } : {}),
        })
      }
      state.items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      state.items = state.items.slice(0, MAX_CENTRE_ITEMS)
    },
    notificationRead(state, action: PayloadAction<string>) {
      const item = state.items.find((entry) => entry.id === action.payload)
      if (item) item.read = true
    },
    allNotificationsRead(state) {
      for (const item of state.items) item.read = true
    },
    notificationsCleared(state) {
      state.items = []
    },
    /** Puts the saved notifications back on launch. */
    hydrateNotifications(state, action: PayloadAction<Partial<NotificationsState>>) {
      Object.assign(state, action.payload)
    },
  },
})

export const {
  remindersScheduled,
  remindersDelivered,
  notificationRead,
  allNotificationsRead,
  notificationsCleared,
  hydrateNotifications,
} = notificationsSlice.actions
export default notificationsSlice.reducer
