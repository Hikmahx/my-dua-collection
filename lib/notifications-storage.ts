import type { ReminderKind, StoredReminder } from '@/lib/reminders/types'
import type { NotificationItem, NotificationsState } from '@/redux/reducers/notificationsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const NOTIFICATIONS_KEY = 'notifications:v1'
const KINDS: readonly ReminderKind[] = ['daily', 'countdown', 'occasion', 'night']

const isText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
const isKind = (value: unknown): value is ReminderKind => KINDS.includes(value as ReminderKind)
const isDateText = (value: unknown): value is string => isText(value) && !Number.isNaN(Date.parse(value))

function sanitizeItems(value: unknown): NotificationItem[] | null {
  if (!Array.isArray(value)) return null
  const seen = new Set<string>()
  const items: NotificationItem[] = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue
    const item = entry as Record<string, unknown>
    if (!isText(item.id) || seen.has(item.id) || !isKind(item.kind)) continue
    if (!isText(item.title) || typeof item.body !== 'string' || !isDateText(item.createdAt)) continue
    seen.add(item.id)
    items.push({
      id: item.id,
      kind: item.kind,
      title: item.title,
      body: item.body,
      createdAt: item.createdAt,
      read: item.read === true,
      ...(isText(item.duaId) ? { duaId: item.duaId } : {}),
    })
  }
  return items
}

function sanitizeSchedule(value: unknown): StoredReminder[] | null {
  if (!Array.isArray(value)) return null
  const schedule: StoredReminder[] = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue
    const reminder = entry as Record<string, unknown>
    if (!isText(reminder.id) || !isKind(reminder.kind) || !isText(reminder.title) || typeof reminder.body !== 'string') continue
    if (!isDateText(reminder.fireAt)) continue
    schedule.push({
      id: reminder.id,
      kind: reminder.kind,
      fireAt: reminder.fireAt,
      title: reminder.title,
      body: reminder.body,
      ...(isText(reminder.duaId) ? { duaId: reminder.duaId } : {}),
    })
  }
  return schedule
}

/** Keeps only what is valid of whatever was saved. */
export function sanitizeNotificationsState(value: unknown): Partial<NotificationsState> {
  if (!value || typeof value !== 'object') return {}
  const saved = value as Record<string, unknown>
  const result: Partial<NotificationsState> = {}
  const items = sanitizeItems(saved.items)
  if (items) result.items = items
  const schedule = sanitizeSchedule(saved.schedule)
  if (schedule) result.schedule = schedule
  return result
}

/** The saved notification centre and schedule, or null if nothing was saved yet. */
export async function loadNotifications(): Promise<Partial<NotificationsState> | null> {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATIONS_KEY)
    return raw ? sanitizeNotificationsState(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export async function saveNotifications(state: NotificationsState) {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(state))
  } catch {
    // not critical: the list still works for this session
  }
}
