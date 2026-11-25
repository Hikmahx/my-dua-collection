import { CARD_BASE_WIDTH, CARD_MIN_HEIGHT_RATIO, type CardOptions } from '@/constants/share-config'
import { getTranslation } from '@/lib/dua-utils'
import type { Dua } from '@/redux/reducers/duasSlice'

/** The text a card shows for a dua, after the options have left things out. Empty strings are left out too. */
export interface CardContent {
  title: string
  arabic: string
  transliteration?: string
  translation?: string
  /** e.g. 'Al-Anbiya · 21:87' (see formatSourceLine). */
  reference?: string
}

export function getCardContent(
  dua: Dua,
  language: string,
  options: CardOptions,
  referenceLine: string | undefined,
): CardContent {
  const transliteration = dua.transliteration?.trim()
  const translation = getTranslation(dua, language).trim()
  return {
    title: dua.title,
    arabic: dua.arabicText,
    ...(options.showTransliteration && transliteration ? { transliteration } : {}),
    ...(options.showTranslation && translation ? { translation } : {}),
    ...(options.showReference && referenceLine ? { reference: referenceLine } : {}),
  }
}

/**
 * How much to shrink the text of a long dua so the card does not grow without end: 1 for a short
 * one, down to MIN_TEXT_SCALE for a very long one. Arabic counts the most because it is set bigger.
 */
export const MIN_TEXT_SCALE = 0.62
const FULL_SIZE_UP_TO = 150 // "weight" (see below) a card holds at full size
const MIN_SIZE_FROM = 1100 // "weight" at which the text is as small as it gets

export function getCardTextScale(content: CardContent): number {
  const weight =
    content.arabic.length * 1.2 + (content.transliteration?.length ?? 0) * 0.55 + (content.translation?.length ?? 0) * 0.6
  if (weight <= FULL_SIZE_UP_TO) return 1
  if (weight >= MIN_SIZE_FROM) return MIN_TEXT_SCALE
  const share = (weight - FULL_SIZE_UP_TO) / (MIN_SIZE_FROM - FULL_SIZE_UP_TO)
  return Number((1 - share * (1 - MIN_TEXT_SCALE)).toFixed(3))
}

/** The card's smallest height for a width (4:5). */
export const cardMinHeight = (width: number) => Math.round(width * CARD_MIN_HEIGHT_RATIO)

/** Everything on the card is designed at CARD_BASE_WIDTH; this turns a design size into px for the real width. */
export const cardUnit = (width: number) => (size: number) => (size * width) / CARD_BASE_WIDTH
