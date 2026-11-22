import { normalizeForSearch } from '@/lib/search'
import type { Dua } from '@/redux/reducers/duasSlice'

/** Two Arabic texts this alike (0 to 1) count as the same dua. */
export const DUPLICATE_MIN_SIMILARITY = 0.85
/** A text that is a piece of a longer dua (a verse taken from it) counts too, if it is long enough and big enough a piece. */
const MIN_PIECE_LENGTH = 12
const MIN_PIECE_RATIO = 0.6
/** The score given to a piece found inside another text. */
const PIECE_SCORE = 0.9

/**
 * The Arabic reduced to its letters, so spelling variants compare equal: no diacritics, Quranic
 * signs or tatweel; every alef, ya, ha and waw/hamza form alike; Persian/Urdu keyboard letters
 * turned into the Arabic ones; and no spaces or punctuation. Anything that is not an Arabic letter
 * is dropped.
 */
export function normalizeArabicForComparison(text: string): string {
  return normalizeForSearch(text)
    .replace(/\u0649/g, '\u064A') // alef maqsura -> ya
    .replace(/[\u06CC\u06D2]/g, '\u064A') // Persian / Urdu ya
    .replace(/\u0629/g, '\u0647') // ta marbuta -> ha
    .replace(/[\u06BE\u06C1]/g, '\u0647') // Urdu ha
    .replace(/\u06A9/g, '\u0643') // Persian kaf
    .replace(/\u0624/g, '\u0648') // waw with hamza
    .replace(/\u0626/g, '\u064A') // ya with hamza
    .replace(/\u0621/g, '') // a lone hamza
    .replace(/[^\u0620-\u064A]/g, '')
}

/** How many single-letter changes turn `a` into `b`. */
function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost)
    }
    previous = current
  }
  return previous[b.length]
}

/** How alike two normalized Arabic texts are, from 0 (nothing) to 1 (the same). */
export function arabicSimilarity(a: string, b: string): number {
  if (!a || !b) return 0
  if (a === b) return 1

  const [short, long] = a.length <= b.length ? [a, b] : [b, a]
  const lengthRatio = short.length / long.length
  const isPiece = short.length >= MIN_PIECE_LENGTH && lengthRatio >= MIN_PIECE_RATIO && long.includes(short)

  // Texts of very different length cannot be alike, so the slow comparison is skipped
  const edited = lengthRatio >= DUPLICATE_MIN_SIMILARITY ? 1 - editDistance(a, b) / long.length : 0
  return Math.max(edited, isPiece ? PIECE_SCORE : 0)
}

/**
 * The dua whose Arabic is the same as `arabicText`, or very close to it, among `duas` (pass every
 * dua: the pre-made ones and the user's own). The title is not looked at. Returns the closest one,
 * or undefined when none is close enough. Used by every way of adding a dua (manual, image, AI)
 * through `useDuplicateDuaGuard`.
 */
export function findSimilarDua(arabicText: string, duas: Dua[]): Dua | undefined {
  const wanted = normalizeArabicForComparison(arabicText)
  if (!wanted) return undefined

  let best: Dua | undefined
  let bestScore = 0
  for (const dua of duas) {
    const score = arabicSimilarity(wanted, normalizeArabicForComparison(dua.arabicText))
    if (score >= DUPLICATE_MIN_SIMILARITY && score > bestScore) {
      best = dua
      bestScore = score
    }
  }
  return best
}
