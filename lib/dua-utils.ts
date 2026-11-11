import type { Dua, DuaSource } from '@/redux/reducers/duasSlice'

export const SOURCE_LABELS: Record<DuaSource, string> = {
  quran: 'Quran',
  hadith: 'Hadith',
}

/** Placeholder for the reference input, by selected source. */
export const REFERENCE_PLACEHOLDERS: Record<DuaSource, string> = {
  quran: '11:38',
  hadith: 'Qudsi 234',
}

const QURAN_REFERENCE = /^(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?$/

/** Quran: '21:87' or a range like '11:39-42' (surah 1-114). Hadith: any non-empty text. */
export function isValidReference(source: DuaSource, reference: string): boolean {
  const value = reference.trim()
  if (source !== 'quran') return value.length > 0

  const match = QURAN_REFERENCE.exec(value)
  if (!match) return false

  const surah = Number(match[1])
  const start = Number(match[2])
  const end = match[3] ? Number(match[3]) : start
  return surah >= 1 && surah <= 114 && start >= 1 && end >= start
}

/** Shows the translation in the chosen language, falling back to English. */
export function getTranslation(dua: Dua, language: string): string {
  return (
    dua.translations[language] ??
    dua.translations.en ??
    Object.values(dua.translations)[0] ??
    ''
  )
}

/** e.g. 'Quran 21:87'. Undefined when the dua has no source. */
export function formatReference(
  dua: Pick<Dua, 'source' | 'reference'>,
): string | undefined {
  if (!dua.source) return undefined
  const label = SOURCE_LABELS[dua.source]
  return dua.reference ? `${label} ${dua.reference}` : label
}

export const isBuiltin = (dua: Dua) => dua.origin === 'builtin'
