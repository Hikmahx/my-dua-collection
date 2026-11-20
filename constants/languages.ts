export interface LanguageInfo {
  code: string
  /** The name in English, e.g. "Urdu". */
  name: string
  /** The name in the language itself, e.g. "اردو". Shown in the language pickers. */
  nativeName: string
  /** Right-to-left script. Not applied yet: the app UI is English only for now. */
  rtl?: boolean
}

/** Every language the app knows about. Used for the translation language picker. */
export const LANGUAGES: readonly LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
]

/**
 * The languages the app's own text (buttons, titles, messages) is available in. To add one:
 * create locales/<code>.ts, register it in locales/index.ts, then add its code here.
 */
export const APP_LANGUAGE_CODES = ['en'] as const
export type AppLanguageCode = (typeof APP_LANGUAGE_CODES)[number]

export const DEFAULT_APP_LANGUAGE: AppLanguageCode = 'en'
export const DEFAULT_TRANSLATION_LANGUAGE = 'en'

export const isAppLanguageCode = (value: unknown): value is AppLanguageCode =>
  APP_LANGUAGE_CODES.some((code) => code === value)

export const isKnownLanguage = (value: unknown): value is string =>
  LANGUAGES.some((language) => language.code === value)

export const getLanguage = (code: string): LanguageInfo =>
  LANGUAGES.find((language) => language.code === code) ?? { code, name: code.toUpperCase(), nativeName: code.toUpperCase() }
