/**
 * Settings for sharing a dua: the picture (share card) and sending it to kindred.
 * Colors are in constants/share-theme.ts, the texts in locales/en.ts (`share.*`).
 */

/** What the card says in its watermark and at the end of a shared text. */
export const SHARE_APP_NAME = 'My Dua Collection'

/**
 * Where "get the app" points. Left empty until the app is in the stores: an empty value is simply
 * left out of the shared text.
 */
export const SHARE_APP_URL = ''

/**
 * The card is drawn at this width (px) and every size inside it scales with the real width, so the
 * preview on a small phone and the saved picture look the same. The picture is saved at EXPORT_WIDTH.
 */
export const CARD_BASE_WIDTH = 360
export const CARD_EXPORT_WIDTH = 1080

/** The card is never shorter than this (width x ratio: 4:5 is the Instagram portrait shape). A long dua makes it taller. */
export const CARD_MIN_HEIGHT_RATIO = 1.25

/**
 * Sending a dua to kindred needs a signed-in user once the backend exists. While there is only dummy
 * data, anyone can try it: a guest sends as the sample user in data/data.json (`currentUserId`).
 * Set this to true to ask guests to sign in first.
 */
export const REQUIRE_SIGN_IN_TO_SHARE = false

/** A tweet is at most 280 characters, so the text sent to X is cut to this. */
export const X_MAX_LENGTH = 280

export const CARD_THEME_IDS = ['emerald', 'night', 'cream'] as const
export type CardThemeId = (typeof CARD_THEME_IDS)[number]
export const DEFAULT_CARD_THEME: CardThemeId = 'emerald'

/** What can be left off the card. The Arabic text is always there. */
export interface CardOptions {
  showTransliteration: boolean
  showTranslation: boolean
  showReference: boolean
}
export const DEFAULT_CARD_OPTIONS: CardOptions = {
  showTransliteration: true,
  showTranslation: true,
  showReference: true,
}
