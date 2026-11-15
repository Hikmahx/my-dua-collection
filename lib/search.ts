/**
 * Search helpers shared by every search box in the app (Tasbih picker, collections, favorites,
 * Explore, ...). Matching is case-insensitive and ignores Arabic diacritics.
 */

/**
 * Lowercase, and Arabic without its marks, so "سبحان" finds "سُبْحَانَ".
 * (Strips the diacritics, Quranic signs and tatweel, and treats every alef the same.)
 */
export function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[\u0671\u0622\u0623\u0625]/g, '\u0627')
    .trim()
}

/** True when any of the fields contains the query. An empty query matches everything. */
export function matchesSearch(query: string, fields: (string | undefined)[]): boolean {
  const q = normalizeForSearch(query)
  if (!q) return true
  return fields.some((field) => !!field && normalizeForSearch(field).includes(q))
}
