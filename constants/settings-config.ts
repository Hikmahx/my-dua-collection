import { getLanguage } from '@/constants/languages'

export const APP_NAME = 'My Dua Collection'
export const SUPPORT_EMAIL = 'hikmayousuph@gmail.com'

export type FontSizeTarget = 'arabic' | 'translation' | 'transliteration'

/** The three font size sliders, in the order they appear (sizes in px). */
export const FONT_SIZE_SETTINGS = [
  { key: 'arabic', min: 16, max: 36 },
  { key: 'translation', min: 10, max: 26 },
  { key: 'transliteration', min: 10, max: 24 },
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

/** English name of a language code, e.g. 'ur' -> 'Urdu'. */
export const languageName = (code: string) => getLanguage(code).name
