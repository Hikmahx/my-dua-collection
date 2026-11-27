import { toHijri, type HijriDate } from '@/lib/hijri'

/**
 * Which part of the Islamic year it is: Ramadan, Dhul Hijjah, how far away the next one is, whether today is the
 * 1st of Ramadan, an Eid or another special day (Islamic new year, Ashura, Mawlid, Isra and Mi'raj), and which night
 * of Ramadan starts this evening. Pure functions: the screens and the reminders read the result of `getIslamicSeason`
 * (through `useIslamicSeason`) and never work out dates themselves.
 *
 * Dates come from lib/hijri.ts (the Umm al-Qura calendar). Communities that start the month after their own moon
 * sighting can be a day off from it, so every function takes an `adjustment` of -1, 0 or +1 day (the setting in
 * Settings). A Hijri day really starts at sunset; here it starts at midnight, as on a calendar.
 */

/** Days added to today before it is turned into a Hijri date: -1 = months start a day later than Umm al-Qura, +1 = a day earlier. */
export type HijriAdjustment = -1 | 0 | 1
export const HIJRI_ADJUSTMENTS: readonly HijriAdjustment[] = [-1, 0, 1]
export const isHijriAdjustment = (value: unknown): value is HijriAdjustment =>
  value === -1 || value === 0 || value === 1

/** Hijri month numbers used here. */
export const MUHARRAM = 1
export const RABI_AL_AWWAL = 3
export const RAJAB = 7
export const RAMADAN = 9
export const SHAWWAL = 10
export const DHUL_HIJJAH = 12

/** The first of the last ten nights of Ramadan. Night 21 starts on the evening of the 20th. */
export const LAST_TEN_NIGHTS_START = 21

export type SeasonName = 'ramadan' | 'dhulHijjah'

/**
 * A special day, or null on an ordinary day. `tasua` and `ashura` are the 9th and 10th of Muharram (fasting both is
 * the sunnah). `mawlid` and `israMiraj` are dates many communities mark and others don't (the exact day of each is not
 * settled).
 */
export type IslamicOccasion =
  | 'islamicNewYear'
  | 'tasua'
  | 'ashura'
  | 'mawlid'
  | 'israMiraj'
  | 'ramadanStart'
  | 'eidAlFitr'
  | 'dhulHijjahStart'
  | 'dayOfArafah'
  | 'eidAlAdha'

export interface IslamicSeason {
  /** Today's Hijri date, after the adjustment. */
  hijri: HijriDate
  isRamadan: boolean
  /** 1-30 during Ramadan, otherwise null. */
  ramadanDay: number | null
  isDhulHijjah: boolean
  /** 1-30 during Dhul Hijjah, otherwise null. */
  dhulHijjahDay: number | null
  /** Today is the 1st of Ramadan: the day to say "Ramadan Mubarak". */
  isFirstOfRamadan: boolean
  /** Today is Eid al-Fitr (1 Shawwal) or Eid al-Adha (10 Dhul Hijjah). */
  isEid: boolean
  occasion: IslamicOccasion | null
  /**
   * The night of Ramadan that starts this evening, or null if tonight is not one. A Hijri day starts at sunset, so
   * the 27th night starts on the evening of the 26th: on the 26th this is 27. Null on the last evening of a
   * 29-day Ramadan, because the next night is Eid eve.
   */
  ramadanNight: number | null
  /** Tonight is one of the last ten nights of Ramadan (night 21 on). */
  isLastTenNights: boolean
  /** Tonight is an odd night of the last ten (21, 23, 25, 27, 29), the nights Laylatul Qadr is sought. */
  isLaylatulQadrNight: boolean
  /**
   * Days until the 1st of Ramadan: 0 when today is it, otherwise the days until the next one (during Ramadan that is
   * next year's, so check `isRamadan` first).
   */
  daysUntilRamadan: number
  daysUntilDhulHijjah: number
  /** The day Ramadan / Dhul Hijjah next starts (or starts today), as a local date at midnight. For scheduling reminders. */
  ramadanStartsOn: Date
  dhulHijjahStartsOn: Date
  /** Whichever of the two starts first, from tomorrow on (a start that is today does not count). */
  next: { season: SeasonName; days: number; startsOn: Date }
}

/** The date `days` from `date`, at noon (so a daylight saving change never moves it to another day). */
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12)

const midnight = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

/** The Hijri date for a date, after the adjustment. */
export const adjustedHijri = (date: Date = new Date(), adjustment: HijriAdjustment = 0): HijriDate =>
  toHijri(addDays(date, adjustment))

/**
 * Days from `date` until a Hijri month starts (0 if it starts that day). It jumps near the end of each month instead
 * of testing every day, so it makes only a few dozen calendar lookups.
 */
export function daysUntilMonthStart(month: number, date: Date = new Date(), adjustment: HijriAdjustment = 0): number {
  const hijriAt = (offset: number) => adjustedHijri(addDays(date, offset), adjustment)

  let offset = 0
  let hijri = hijriAt(offset)
  if (hijri.month === month && hijri.day === 1) return 0

  // at most 13 months ahead (a month is 29 or 30 days), so this always finds it
  for (let step = 0; step < 14; step++) {
    // near the end of this month, then day by day until the next month starts
    offset += Math.max(0, 28 - hijri.day)
    do {
      offset += 1
      hijri = hijriAt(offset)
    } while (hijri.day !== 1 && offset < 400)
    if (hijri.month === month) return offset
  }
  return offset
}

/** What `occasion` today is, from its Hijri date. */
export function occasionOf({ month, day }: Pick<HijriDate, 'month' | 'day'>): IslamicOccasion | null {
  if (month === MUHARRAM && day === 1) return 'islamicNewYear'
  if (month === MUHARRAM && day === 9) return 'tasua'
  if (month === MUHARRAM && day === 10) return 'ashura'
  if (month === RABI_AL_AWWAL && day === 12) return 'mawlid'
  if (month === RAJAB && day === 27) return 'israMiraj'
  if (month === RAMADAN && day === 1) return 'ramadanStart'
  if (month === SHAWWAL && day === 1) return 'eidAlFitr'
  if (month === DHUL_HIJJAH && day === 1) return 'dhulHijjahStart'
  if (month === DHUL_HIJJAH && day === 9) return 'dayOfArafah'
  if (month === DHUL_HIJJAH && day === 10) return 'eidAlAdha'
  return null
}

/** Everything the app needs to know about today in the Islamic year. */
export function getIslamicSeason(date: Date = new Date(), adjustment: HijriAdjustment = 0): IslamicSeason {
  const hijri = adjustedHijri(date, adjustment)
  const occasion = occasionOf(hijri)
  const isRamadan = hijri.month === RAMADAN
  const isDhulHijjah = hijri.month === DHUL_HIJJAH

  // the Hijri day of tomorrow's date is the number of the night that starts this evening
  const tonight = adjustedHijri(addDays(date, 1), adjustment)
  const ramadanNight = tonight.month === RAMADAN ? tonight.day : null
  const isLastTenNights = ramadanNight !== null && ramadanNight >= LAST_TEN_NIGHTS_START

  const daysUntilRamadan = daysUntilMonthStart(RAMADAN, date, adjustment)
  const daysUntilDhulHijjah = daysUntilMonthStart(DHUL_HIJJAH, date, adjustment)
  const startsOn = (days: number) => midnight(addDays(date, days))

  // from tomorrow on: a month that starts today is not "next"
  const upcoming = [
    { season: 'ramadan' as const, days: daysUntilRamadan },
    { season: 'dhulHijjah' as const, days: daysUntilDhulHijjah },
  ]
    .filter((item) => item.days > 0)
    .sort((a, b) => a.days - b.days)[0]

  return {
    hijri,
    isRamadan,
    ramadanDay: isRamadan ? hijri.day : null,
    isDhulHijjah,
    dhulHijjahDay: isDhulHijjah ? hijri.day : null,
    isFirstOfRamadan: occasion === 'ramadanStart',
    isEid: occasion === 'eidAlFitr' || occasion === 'eidAlAdha',
    occasion,
    ramadanNight,
    isLastTenNights,
    isLaylatulQadrNight: ramadanNight !== null && isLastTenNights && ramadanNight % 2 === 1,
    daysUntilRamadan,
    daysUntilDhulHijjah,
    ramadanStartsOn: startsOn(daysUntilRamadan),
    dhulHijjahStartsOn: startsOn(daysUntilDhulHijjah),
    next: { ...upcoming, startsOn: startsOn(upcoming.days) },
  }
}
