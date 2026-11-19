export const APP_NAME = 'My Dua Collection'
export const SUPPORT_EMAIL = 'hikmayousuph@gmail.com'

/** Shown under "Daily reminder". Reminders can't be scheduled yet, so the toggle only saves the choice. */
export const DAILY_REMINDER_TIME = '8:00 AM'

export type FontSizeTarget = 'arabic' | 'translation' | 'transliteration'

/** The three font size sliders, in the order they appear (sizes in px). */
export const FONT_SIZE_SETTINGS = [
  { key: 'arabic', label: 'Arabic', min: 16, max: 36 },
  { key: 'translation', label: 'Translation', min: 10, max: 26 },
  { key: 'transliteration', label: 'Transliteration', min: 10, max: 24 },
] as const

export const DEFAULT_FONT_SIZES: Record<FontSizeTarget, number> = {
  arabic: 28,
  translation: 16,
  transliteration: 14,
}

/** The sample dua shown under the sliders (Quran 20:114). */
export const FONT_PREVIEW = {
  arabic: 'رَبِّ زِدْنِي عِلْمًا',
  translation: 'My Lord, increase me in knowledge.',
  transliteration: "Rabbi zidni 'ilma",
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ar: 'Arabic',
  ur: 'Urdu',
  fr: 'French',
  tr: 'Turkish',
  id: 'Indonesian',
  bn: 'Bengali',
  es: 'Spanish',
}

export const languageName = (code: string) => LANGUAGE_NAMES[code] ?? code.toUpperCase()
