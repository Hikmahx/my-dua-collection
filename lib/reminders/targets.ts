import { DHUL_HIJJAH, MUHARRAM, RAMADAN, SHAWWAL, RABI_AL_AWWAL, RAJAB, type IslamicOccasion } from '@/lib/islamic-season'

/**
 * The special days that get reminders. `countdown` lists how many days before each one a reminder goes out, and
 * `countdownAt` when in the day ('evening' for the fasts and Ramadan's last day, so there is time to plan suhoor).
 * Every target also gets a reminder on its own day (at most one special reminder goes out a day, see build-reminders.ts).
 */
export interface ReminderTarget {
  occasion: IslamicOccasion
  month: number
  day: number
  countdown: readonly number[]
  countdownAt: 'morning' | 'evening'
}

export const REMINDER_TARGETS: readonly ReminderTarget[] = [
  { occasion: 'ramadanStart', month: RAMADAN, day: 1, countdown: [100, 50, 30, 7, 1], countdownAt: 'morning' },
  { occasion: 'eidAlFitr', month: SHAWWAL, day: 1, countdown: [3], countdownAt: 'morning' },
  { occasion: 'eidAlAdha', month: DHUL_HIJJAH, day: 10, countdown: [3], countdownAt: 'morning' },
  { occasion: 'dhulHijjahStart', month: DHUL_HIJJAH, day: 1, countdown: [3, 2, 1], countdownAt: 'evening' },
  { occasion: 'dayOfArafah', month: DHUL_HIJJAH, day: 9, countdown: [3, 2, 1], countdownAt: 'evening' },
  { occasion: 'ashura', month: MUHARRAM, day: 10, countdown: [3, 2, 1], countdownAt: 'evening' },
  { occasion: 'tasua', month: MUHARRAM, day: 9, countdown: [], countdownAt: 'morning' },
  { occasion: 'islamicNewYear', month: MUHARRAM, day: 1, countdown: [], countdownAt: 'morning' },
  { occasion: 'mawlid', month: RABI_AL_AWWAL, day: 12, countdown: [], countdownAt: 'morning' },
  { occasion: 'israMiraj', month: RAJAB, day: 27, countdown: [], countdownAt: 'morning' },
]

/** The odd nights of the last ten of Ramadan. Night 21 also says that the last ten nights begin. */
export const LAYLATUL_QADR_NIGHTS = [21, 23, 25, 27, 29] as const
