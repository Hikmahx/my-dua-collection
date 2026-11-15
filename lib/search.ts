/**
 * Search helpers shared by every search box in the app (Tasbih picker, collections, favorites,
 * Explore, ...). Matching is case-insensitive and ignores Arabic diacritics.
 */

/**
 * Lowercase, and Arabic without its marks, so "سبحان" finds "سُبْحَانَ".
 * (Strips the diacritics, Quranic signs and tatweel, and treats every alef the same.)
 * Apostrophes are ignored and hyphens count as spaces, so "ali imran" finds "Ali 'Imran"
 * and "al baqarah" finds "Al-Baqarah".
 */
export function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[\u0671\u0622\u0623\u0625]/g, '\u0627')
    .replace(/['\u2018\u2019\u02BB\u02BC\u02BF\u02BE`]/g, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** True when any of the fields contains the query. An empty query matches everything. */
export function matchesSearch(query: string, fields: (string | undefined)[]): boolean {
  const q = normalizeForSearch(query)
  if (!q) return true
  return fields.some((field) => !!field && normalizeForSearch(field).includes(q))
}
