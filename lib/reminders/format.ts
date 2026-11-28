import type { TFunction } from '@/locales'

/** "8:00 AM" or "08:00", in the style of the phone's language and region. */
export const formatReminderTime = ({ hour, minute }: { hour: number; minute: number }) =>
  new Date(2000, 0, 1, hour, minute).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

/** How long ago a notification was sent: "Just now", "5 min ago", "3 h ago", "Yesterday", or the date. */
export function timeAgo(iso: string, now: Date, t: TFunction): string {
  const then = new Date(iso)
  const minutes = Math.floor((now.getTime() - then.getTime()) / 60_000)
  if (minutes < 1) return t('centre.justNow')
  if (minutes < 60) return t('centre.minutesAgo', { count: minutes })

  const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const daysBetween = Math.round((startOfDay(now) - startOfDay(then)) / 86_400_000)
  if (daysBetween === 0) return t('centre.hoursAgo', { count: Math.floor(minutes / 60) })
  if (daysBetween === 1) return t('centre.yesterday')
  return then.toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
    ...(then.getFullYear() !== now.getFullYear() ? { year: 'numeric' as const } : {}),
  })
}
