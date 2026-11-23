import { themeColors } from '@/constants/theme-colors'

/** What the user can switch on or off in the "Export as PDF" dialog. Arabic text is always in the PDF. */
export interface PdfExportOptions {
  /** A first page with the logo, the app name and the collection name (like the splash screen). */
  coverPage: boolean
  translation: boolean
  transliteration: boolean
  /** The source line under a dua, e.g. "Al-Baqarah · 2:201". */
  source: boolean
  /** The note / background saved with a dua (its `info`). */
  notes: boolean
  /** "Recite 3 times" under a dua that is recited more than once. */
  repeat: boolean
  /** Every dua starts on its own page. Off: duas follow each other and share pages. */
  onePerPage: boolean
}

export const DEFAULT_PDF_OPTIONS: PdfExportOptions = {
  coverPage: true,
  translation: true,
  transliteration: true,
  source: true,
  notes: true,
  repeat: true,
  onePerPage: true,
}

/** The toggles of the dialog that are plain on / off switches over a content option, in display order. */
export const PDF_CONTENT_OPTION_KEYS = ['translation', 'transliteration', 'source', 'notes', 'repeat'] as const
export type PdfContentOptionKey = (typeof PDF_CONTENT_OPTION_KEYS)[number]

/**
 * Page size in points (1/72 inch): A4. Every length in the PDF is written in these units and
 * multiplied by `unit` (see `pdfUnit`), so the PDF looks the same on iOS and Android.
 */
export const PDF_PAGE = { width: 595, height: 842 } as const

/**
 * Size of one layout unit, in CSS px, on each platform.
 *
 * expo-print lays the HTML out at 72 px per inch on iOS (a WKWebView as wide as the page), but at
 * 96 px per inch on Android (the WebView's own print layout), so Android needs everything 96 / 72
 * times bigger to fill the same page. If a platform ever shows the content too small or too large
 * on the page, this is the one number to change.
 */
export const PDF_UNIT_IOS = 1
export const PDF_UNIT_ANDROID = 96 / 72

/** A length of `n` layout units as CSS. `--u` is set on the page from `pdfUnit` (see collection-pdf-html.ts). */
export const u = (n: number) => `calc(var(--u) * ${Math.round(n * 1000) / 1000})`

/** Colors of the PDF, taken from the app's palette (constants/theme-colors.ts). */
export const PDF_COLORS = {
  /** Deep teal: dua titles and the app name in the footer. */
  teal: themeColors.veryDarkBg,
  gold: themeColors.brightGold,
  softGold: themeColors.softGold,
  coverBackground: '#00212E',
  coverText: themeColors.lightBg,
  coverMuted: themeColors.lightGrayishTextMuted,
  text: themeColors.darkText,
  body: '#2B2B2B',
  muted: '#8A8A8A',
  noteBackground: themeColors.pillBg,
} as const

/** Browsers lay the page out at 96 px per inch too, like Android. */
export const PDF_UNIT_BROWSER = PDF_UNIT_ANDROID

/**
 * Turns a collection name into the file name of its PDF: lowercase, words joined with "-", and no characters a
 * file name can't have. "Quranic Duas" becomes "quranic-duas" (without the ".pdf").
 */
export function pdfFileName(collectionName: string, fallback = 'my-dua-collection'): string {
  const slug = collectionName
    .toLowerCase()
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')
  return slug || fallback
}
