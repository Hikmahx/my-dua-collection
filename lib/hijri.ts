export const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Akhir",
  'Jumada al-Ula',
  'Jumada al-Akhirah',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qa'dah",
  'Dhu al-Hijjah',
] as const

export interface HijriDate {
  day: number
  month: number // 1-12
  monthName: string
  year: number
}

/**
 * Gregorian -> Hijri with the tabular (civil) Islamic calendar. It works anywhere, but it can be
 * a day off from the Umm al-Qura calendar most people follow. Used when the phone has no
 * Umm al-Qura support (see toHijri).
 */
export function toHijriTabular(date: Date = new Date()): HijriDate {
  // Julian day number of the (local) calendar day
  const jdn = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000) + 2440588

  let l = jdn - 1948440 + 10632
  const n = Math.floor((l - 1) / 10631)
  l = l - 10631 * n + 354
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238)
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29

  const month = Math.floor((24 * l) / 709)
  return {
    day: l - Math.floor((709 * month) / 24),
    month,
    monthName: HIJRI_MONTHS[month - 1],
    year: 30 * n + j - 30,
  }
}

/** The Umm al-Qura date from the phone's own calendar data, or null if it doesn't have it. */
function toHijriUmmAlQura(date: Date): HijriDate | null {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(date)
    const part = (type: string) => Number(parts.find((p) => p.type === type)?.value)
    const day = part('day')
    const month = part('month')
    const year = part('year')

    // An unsupported calendar quietly returns the Gregorian date (year ~2026), so check the range
    const valid = day >= 1 && day <= 30 && month >= 1 && month <= 12 && year > 1300 && year < 1700
    return valid ? { day, month, monthName: HIJRI_MONTHS[month - 1], year } : null
  } catch {
    return null
  }
}

/** Today's (or any) Hijri date: Umm al-Qura when the phone supports it, otherwise the tabular calendar. */
export const toHijri = (date: Date = new Date()): HijriDate => toHijriUmmAlQura(date) ?? toHijriTabular(date)

/** e.g. "5 Jumada al-Akhirah 1448 AH" */
export const formatHijri = ({ day, monthName, year }: HijriDate) => `${day} ${monthName} ${year} AH`
