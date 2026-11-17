import { SURAH_NAMES } from '@/constants/surah-names'
import { DEFAULT_DUA_REPEAT, FAVORITES_LIST_ID } from '@/constants/dua-config'
import { normalizeForSearch } from '@/lib/search'
import type { Dua, DuaContent, DuaSource } from '@/redux/reducers/duasSlice'

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

/**
 * Subtitle for a dua in lists: 'Al-Baqarah · 2:201' for the Quran, 'Hadith · Qudsi 234' for hadith.
 * Undefined when the dua has no source.
 */
export function formatSourceLine(dua: Pick<Dua, 'source' | 'reference'>): string | undefined {
  if (!dua.source) return undefined
  if (dua.source === 'quran' && dua.reference) {
    const [surah, verses] = dua.reference.split(':')
    const name = SURAH_NAMES[Number(surah) - 1]
    if (name && verses) return `${name} · ${surah}:${verses.replace('-', '–')}`
  }
  const label = SOURCE_LABELS[dua.source]
  return dua.reference ? `${label} · ${dua.reference}` : label
}

/** The surah a Quran dua is from, e.g. reference '21:87' -> 'Al-Anbiya'. */
export function getSurahName(dua: Pick<Dua, 'source' | 'reference'>): string | undefined {
  if (dua.source !== 'quran' || !dua.reference) return undefined
  return SURAH_NAMES[parseInt(dua.reference, 10) - 1]
}

/**
 * The hadith collection of a hadith dua: the text before the number in its reference,
 * e.g. 'Bukhari 6324' -> 'Bukhari', 'Qudsi 234' -> 'Qudsi'.
 */
export function getHadithName(dua: Pick<Dua, 'source' | 'reference'>): string | undefined {
  if (dua.source !== 'hadith' || !dua.reference) return undefined
  const reference = dua.reference.trim()
  const match = /^(.*?)[\s,:#.-]*\d/.exec(reference)
  return (match ? match[1] : reference).trim() || undefined
}

export type SourceFilter = { kind: 'surah' | 'hadith'; name: string }

/** True when the dua is from the filtered surah or hadith collection. */
export function matchesSourceFilter(dua: Dua, filter: SourceFilter): boolean {
  const name = filter.kind === 'surah' ? getSurahName(dua) : getHadithName(dua)
  return !!name && normalizeForSearch(name) === normalizeForSearch(filter.name)
}

/** The surahs (in Quran order) and hadith collections (A-Z) found in a list of duas. */
export function listSourceNames(duas: Dua[]): { surahs: string[]; hadiths: string[] } {
  const surahNumbers = new Set<number>()
  const hadiths = new Map<string, string>() // normalised name -> name as written first
  for (const dua of duas) {
    if (getSurahName(dua)) surahNumbers.add(parseInt(dua.reference!, 10))
    const hadith = getHadithName(dua)
    if (hadith && !hadiths.has(normalizeForSearch(hadith))) hadiths.set(normalizeForSearch(hadith), hadith)
  }
  return {
    surahs: [...surahNumbers].sort((a, b) => a - b).map((n) => SURAH_NAMES[n - 1]),
    hadiths: [...hadiths.values()].sort((a, b) => a.localeCompare(b)),
  }
}

/** The text of a dua that search looks at (use with useSearch). */
export const duaSearchFields = (dua: Dua) => [
  dua.title,
  dua.transliteration,
  dua.arabicText,
  ...Object.values(dua.translations),
]

/**
 * Search for the collection and Favorites screens: the usual text plus the surah name and
 * the hadith name. (The Tasbih picker keeps using plain duaSearchFields.)
 */
export const duaSourceSearchFields = (dua: Dua) => [
  ...duaSearchFields(dua),
  getSurahName(dua),
  getHadithName(dua),
]

/** How many times the dua is recited: `repeat`, or the default (once). */
export const getDuaRepeat = (dua: Pick<Dua, 'repeat'>) => {
  const count = dua.repeat
  return count && count > 0 ? Math.floor(count) : DEFAULT_DUA_REPEAT
}

/** The duas of a list the Dua screen is opened from: Favorites, or a collection id. */
export const getListDuas = (duas: Dua[], listId: string | undefined) =>
  listId === FAVORITES_LIST_ID
    ? duas.filter((dua) => dua.isFavorite)
    : duas.filter((dua) => !!listId && dua.categories.includes(listId))

/** The dua as plain text, for sharing: title, Arabic, transliteration, translation and source. */
export function duaShareText(dua: Dua, language: string): string {
  return [dua.title, dua.arabicText, dua.transliteration, getTranslation(dua, language), formatSourceLine(dua)]
    .filter(Boolean)
    .join('\n\n')
}

export const isBuiltin = (dua: Dua) => dua.origin === 'builtin'

/**
 * What is saved on the device: only what the user changed. The built-in duas always come from
 * data/dua.json, so new or edited ones show up without clearing anything.
 */
export interface StoredDuas {
  /** Ids of every dua marked as a favorite, built-in or added. */
  favoriteIds: string[]
  /** The duas the user added (anything that is not `builtin`), without `isFavorite`. */
  userDuas: DuaContent[]
}

/**
 * The part of the current duas that is worth saving. A dua counts as built-in when its id is one
 * of `builtIn` (not by its `origin` label), so it is never saved twice.
 */
export function toStoredDuas(duas: Dua[], builtIn: Dua[]): StoredDuas {
  const builtInIds = new Set(builtIn.map((dua) => dua.id))
  return {
    favoriteIds: duas.filter((dua) => dua.isFavorite).map((dua) => dua.id),
    userDuas: duas
      .filter((dua) => dua.origin !== 'builtin' && !builtInIds.has(dua.id))
      .map((dua) => {
        const content: Partial<Dua> = { ...dua }
        delete content.isFavorite
        return content as DuaContent
      }),
  }
}

/** True when `value` has the shape `toStoredDuas` produces. */
export function isStoredDuas(value: unknown): value is StoredDuas {
  if (!value || typeof value !== 'object') return false
  const { favoriteIds, userDuas } = value as Partial<StoredDuas>
  return (
    Array.isArray(favoriteIds) &&
    favoriteIds.every((id) => typeof id === 'string') &&
    Array.isArray(userDuas) &&
    userDuas.every((dua) => !!dua && typeof dua === 'object' && typeof dua.id === 'string')
  )
}

/**
 * The built-in duas plus what the user saved: their favorites, and the duas they added.
 * A saved dua whose id is now a built-in one is ignored, so the built-in text wins.
 */
export function mergeStoredDuas(stored: StoredDuas, builtIn: Dua[]): Dua[] {
  const favorites = new Set(stored.favoriteIds)
  const builtInIds = new Set(builtIn.map((dua) => dua.id))
  const fresh = builtIn.map((dua) => ({ ...dua, isFavorite: favorites.has(dua.id) }))
  const added = stored.userDuas
    .filter((dua) => !builtInIds.has(dua.id) && dua.origin !== 'builtin')
    .map((dua) => ({ ...dua, isFavorite: favorites.has(dua.id) }))
  return [...fresh, ...added]
}
