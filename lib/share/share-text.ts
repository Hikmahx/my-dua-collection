import { SHARE_APP_NAME, SHARE_APP_URL, X_MAX_LENGTH, type CardOptions } from '@/constants/share-config'
import { formatSourceLine, getTranslation } from '@/lib/dua-utils'
import type { Dua } from '@/redux/reducers/duasSlice'

/**
 * The dua as plain text, for "Copy text": the same parts the card shows (so the switches of the card
 * editor apply), then the app's name (and link, once there is one).
 */
export function buildShareText(dua: Dua, language: string, options: CardOptions): string {
  const parts = [dua.title, dua.arabicText]
  if (options.showTransliteration) parts.push(dua.transliteration?.trim() ?? '')
  if (options.showTranslation) parts.push(getTranslation(dua, language).trim())
  if (options.showReference) parts.push(formatSourceLine(dua) ?? '')
  parts.push(['— ' + SHARE_APP_NAME, SHARE_APP_URL].filter(Boolean).join('\n'))
  return parts.filter(Boolean).join('\n\n')
}

/** The text cut to a length with an ellipsis, for places with a limit (X). */
export function truncateText(text: string, max = X_MAX_LENGTH): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`
}

/**
 * A short line sent along with the card picture (X shows it as the post text): title, source and
 * the app's name, cut to the length X allows.
 */
export function buildShareCaption(dua: Dua): string {
  const source = formatSourceLine(dua)
  const lead = [dua.title, source].filter(Boolean).join(' · ')
  return truncateText([lead, '— ' + SHARE_APP_NAME, SHARE_APP_URL].filter(Boolean).join(' '))
}
