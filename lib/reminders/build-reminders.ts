import {
  DAILY_WINDOW_DAYS,
  EVENING_TIME,
  MAX_SCHEDULED,
  MORNING_TIME,
  SPECIAL_HORIZON_DAYS,
} from '@/constants/reminder-config'
import {
  adjustedHijri,
  daysUntilHijriDate,
  RAMADAN,
  type HijriAdjustment,
  type IslamicOccasion,
} from '@/lib/islamic-season'
import { LAYLATUL_QADR_NIGHTS, REMINDER_TARGETS, type ReminderTarget } from '@/lib/reminders/targets'
import type { ReminderKind, ReminderSpec } from '@/lib/reminders/types'
import type { TFunction } from '@/locales'

export interface ReminderSettings {
  dailyReminder: boolean
  dailyTime: { hour: number; minute: number }
  /** The "Special reminders" toggle: Ramadan, Eid, Ashura and the other special days. */
  specialReminders: boolean
  hijriAdjustment: HijriAdjustment
}

/** What a daily reminder needs of a dua. */
export interface ReminderDua {
  id: string
  title: string
  /** The translation in the user's language (may be empty). */
  translation: string
}

interface BuildInput {
  now: Date
  settings: ReminderSettings
  duas: readonly ReminderDua[]
  t: TFunction
}

/** A reminder that could be sent; at most one special reminder goes out a day, the highest priority first. */
interface Candidate {
  spec: ReminderSpec
  priority: number
}

const PRIORITY: Record<ReminderKind, number> = { occasion: 3, night: 2, countdown: 1, daily: 0 }

const pad = (value: number) => String(value).padStart(2, '0')
const dayKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const dayAt = (date: Date, days: number, time: { hour: number; minute: number }) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, time.hour, time.minute)

/** A whole number for each calendar day, so the daily dua changes every day and is the same however often this runs. */
const dayNumber = (date: Date) => Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000)

/** The first `max` characters, cut at a word, with an ellipsis. */
function shorten(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`
}

function dailyReminders({ now, settings, duas, t }: BuildInput): ReminderSpec[] {
  const specs: ReminderSpec[] = []
  // today's time may have passed already, so go one day further to still have DAILY_WINDOW_DAYS reminders ahead
  for (let offset = 0; offset <= DAILY_WINDOW_DAYS && specs.length < DAILY_WINDOW_DAYS; offset++) {
    const fireAt = dayAt(now, offset, settings.dailyTime)
    if (fireAt <= now) continue
    const dua = duas.length > 0 ? duas[dayNumber(fireAt) % duas.length] : undefined
    const body = dua
      ? [dua.title, shorten(dua.translation, 110)].filter(Boolean).join(': ')
      : t('reminder.daily.fallback')
    specs.push({ id: `daily-${dayKey(fireAt)}`, kind: 'daily', fireAt, title: t('reminder.daily.title'), body, duaId: dua?.id })
  }
  return specs
}

/** What the notification says on the day itself. */
function occasionText(occasion: IslamicOccasion, year: number, t: TFunction): { title: string; body: string } {
  switch (occasion) {
    case 'ramadanStart':
      return { title: t('reminder.ramadan.startTitle'), body: t('reminder.ramadan.startBody') }
    case 'eidAlFitr':
    case 'eidAlAdha':
      return { title: t('reminder.eid.title'), body: t('reminder.eid.body') }
    case 'dhulHijjahStart':
      return { title: t('reminder.dhulHijjah.startTitle'), body: t('reminder.dhulHijjah.startBody') }
    case 'dayOfArafah':
      return { title: t('reminder.arafah.title'), body: t('reminder.arafah.body') }
    case 'tasua':
      return { title: t('reminder.tasua.title'), body: t('reminder.tasua.body') }
    case 'ashura':
      return { title: t('reminder.ashura.title'), body: t('reminder.ashura.body') }
    case 'islamicNewYear':
      return { title: t('reminder.newYear.title'), body: t('reminder.newYear.body', { year }) }
    case 'mawlid':
      return { title: t('reminder.mawlid.title'), body: t('reminder.mawlid.body') }
    case 'israMiraj':
      return { title: t('reminder.isra.title'), body: t('reminder.isra.body') }
  }
}

/** What the notification says `days` days before the occasion. Occasions without a countdown never get here. */
function countdownText(occasion: IslamicOccasion, days: number, t: TFunction): { title: string; body: string } {
  const when = t('reminder.when', { days })
  switch (occasion) {
    case 'ramadanStart':
      if (days === 1) return { title: t('reminder.ramadan.tomorrowTitle'), body: t('reminder.ramadan.tomorrowBody') }
      return {
        title: t('reminder.ramadan.countdownTitle'),
        body: days === 7 ? t('reminder.ramadan.weekBody') : t('reminder.ramadan.countdownBody', { days }),
      }
    case 'eidAlFitr':
      return { title: t('reminder.eidFitr.countdownTitle'), body: t('reminder.eid.countdownBody', { days }) }
    case 'eidAlAdha':
      return { title: t('reminder.eidAdha.countdownTitle'), body: t('reminder.eid.countdownBody', { days }) }
    case 'dhulHijjahStart':
      return { title: t('reminder.dhulHijjah.countdownTitle'), body: t('reminder.dhulHijjah.countdownBody', { when }) }
    case 'dayOfArafah':
      return { title: t('reminder.arafah.countdownTitle'), body: t('reminder.arafah.countdownBody', { when }) }
    case 'ashura':
      return { title: t('reminder.ashura.countdownTitle'), body: t('reminder.ashura.countdownBody', { when }) }
    default:
      return occasionText(occasion, 0, t)
  }
}

/** Days from today until this Ramadan began or the next one begins (negative while Ramadan is on). */
function ramadanStartOffset(now: Date, adjustment: HijriAdjustment): number {
  const today = adjustedHijri(now, adjustment)
  return today.month === RAMADAN ? -(today.day - 1) : daysUntilHijriDate(RAMADAN, 1, now, adjustment)
}

function targetCandidates(target: ReminderTarget, { now, settings, t }: BuildInput): Candidate[] {
  const days = daysUntilHijriDate(target.month, target.day, now, settings.hijriAdjustment)
  const occasionDay = dayAt(now, days, { hour: 0, minute: 0 })
  const year = adjustedHijri(occasionDay, settings.hijriAdjustment).year
  const out: Candidate[] = []

  const day = occasionText(target.occasion, year, t)
  out.push({
    priority: PRIORITY.occasion,
    spec: {
      id: `${target.occasion}-${dayKey(occasionDay)}`,
      kind: 'occasion',
      fireAt: dayAt(occasionDay, 0, MORNING_TIME),
      ...day,
    },
  })

  const at = target.countdownAt === 'evening' ? EVENING_TIME : MORNING_TIME
  for (const before of target.countdown) {
    const text = countdownText(target.occasion, before, t)
    out.push({
      priority: PRIORITY.countdown,
      spec: {
        id: `${target.occasion}-countdown-${before}-${dayKey(occasionDay)}`,
        kind: 'countdown',
        fireAt: dayAt(occasionDay, -before, at),
        ...text,
      },
    })
  }
  return out
}

/** The evenings that start the odd nights of the last ten of Ramadan (night 21 begins on the evening of the 20th). */
function nightCandidates({ now, settings, t }: BuildInput): Candidate[] {
  const start = ramadanStartOffset(now, settings.hijriAdjustment)
  return LAYLATUL_QADR_NIGHTS.map((night) => {
    const evening = dayAt(now, start + night - 2, EVENING_TIME)
    const first = night === LAYLATUL_QADR_NIGHTS[0]
    return {
      priority: PRIORITY.night,
      spec: {
        id: `night-${night}-${dayKey(evening)}`,
        kind: 'night' as const,
        fireAt: evening,
        title: first ? t('reminder.night.firstTitle') : t('reminder.night.title'),
        body: first ? t('reminder.night.firstBody') : t('reminder.night.body', { night }),
      },
    }
  })
}

/** Keeps the best reminder of each day (one special reminder a day) and drops what is in the past or too far ahead. */
function onePerDay(candidates: Candidate[], now: Date): ReminderSpec[] {
  const horizon = dayAt(now, SPECIAL_HORIZON_DAYS, { hour: 23, minute: 59 })
  const best = new Map<string, Candidate>()
  for (const candidate of candidates) {
    const { fireAt } = candidate.spec
    if (fireAt <= now || fireAt > horizon) continue
    const key = dayKey(fireAt)
    const current = best.get(key)
    const better =
      !current ||
      candidate.priority > current.priority ||
      (candidate.priority === current.priority && fireAt < current.spec.fireAt)
    if (better) best.set(key, candidate)
  }
  return [...best.values()].map((candidate) => candidate.spec)
}

/**
 * Everything that should be scheduled right now, soonest first: the daily reminder for the next two weeks (a
 * different dua each day), and, when the Special reminders toggle is on, the countdowns, the special days and the
 * odd nights of the last ten of Ramadan that fall in the next ~4 months, one a day at most. It never holds more than
 * MAX_SCHEDULED (iOS keeps 64): the farthest special reminders are the ones left out, and they come back as the date
 * gets closer, because this is worked out again whenever the app opens or a setting changes.
 */
export function buildReminders(input: BuildInput): ReminderSpec[] {
  const { now, settings } = input
  const daily = settings.dailyReminder ? dailyReminders(input) : []

  let special: ReminderSpec[] = []
  if (settings.specialReminders) {
    const candidates = [...REMINDER_TARGETS.flatMap((target) => targetCandidates(target, input)), ...nightCandidates(input)]
    special = onePerDay(candidates, now)
      .sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime())
      .slice(0, Math.max(0, MAX_SCHEDULED - daily.length))
  }

  return [...daily, ...special].sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime())
}
