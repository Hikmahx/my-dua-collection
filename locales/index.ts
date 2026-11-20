import { DEFAULT_APP_LANGUAGE, type AppLanguageCode } from '@/constants/languages'
import { en, type TranslationKey } from './en'

export type { TranslationKey }

/** Values for the {placeholders} of a text, e.g. t('tasbih.resetMessage', { count: 12 }). */
export type TranslationParams = Record<string, string | number>

export type TFunction = (key: TranslationKey, params?: TranslationParams) => string

type Dictionary = Partial<Record<TranslationKey, string | ((params: any) => string)>>

/**
 * One dictionary per app language. A text that is missing in a language falls back to English,
 * so a new language can be added a few texts at a time. To add one: create locales/<code>.ts
 * (same keys as en.ts), add it here, and add its code to APP_LANGUAGE_CODES in constants/languages.ts.
 */
const DICTIONARIES: Record<AppLanguageCode, Dictionary> = {
  en,
}

/** Looks up a text. "Hello {name}" + { name: 'Sara' } -> "Hello Sara". Texts can also be functions (for plurals). */
export function translate(language: AppLanguageCode, key: TranslationKey, params?: TranslationParams): string {
  const entry = DICTIONARIES[language]?.[key] ?? en[key] ?? key
  if (typeof entry === 'function') return (entry as (values: TranslationParams) => string)(params ?? {})
  if (!params) return entry
  return entry.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
}

export const makeT =
  (language: AppLanguageCode = DEFAULT_APP_LANGUAGE): TFunction =>
  (key, params) =>
    translate(language, key, params)
