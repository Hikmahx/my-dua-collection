import { getLanguage } from '@/constants/languages'
import { PRAYER_BEADS_PATH, PRAYER_BEADS_VIEWBOX } from '@/constants/prayer-beads-path'
import { APP_NAME } from '@/constants/settings-config'
import { formatSourceLine, getTranslation } from '@/lib/dua-utils'
import type { TFunction } from '@/locales'
import { COVER_ART_SVG } from '@/lib/pdf/cover-art'
import {
  CONTENT_TOP,
  CONTENT_WIDTH,
  MARGIN_X,
  PAGE_BOX_HEIGHT,
  fixedBlock,
  paginate,
  textBlock,
  type Block,
  type DuaUnit,
  type PageContent,
  type TextMetrics,
} from '@/lib/pdf/pdf-layout'
import { PDF_COLORS, PDF_PAGE, u, type PdfExportOptions } from '@/lib/pdf/pdf-config'
import { parseRichText, type RichBlock } from '@/lib/rich-text'
import type { Dua } from '@/redux/reducers/duasSlice'

/** The fonts of the PDF, each as the base64 text of its .ttf file (see pdf-fonts.ts). */
export interface PdfFonts {
  berkshire: string
  nunito: string
  nunitoBold: string
  nunitoBoldItalic: string
  /** The Arabic font the user chose in Settings. */
  arabic: string
}

export interface CollectionPdfInput {
  collectionName: string
  /** The duas in the order to print them. */
  duas: Dua[]
  options: PdfExportOptions
  /** Language code of the translation to print (falls back to English per dua). */
  translationLanguage: string
  fonts: PdfFonts
  /** Size of one layout unit in CSS px: PDF_UNIT_IOS or PDF_UNIT_ANDROID. */
  unit: number
  t: TFunction
  /** Date shown on the cover. */
  now?: Date
}

// How much room each kind of text takes (used to fill the pages, see pdf-layout.ts)
const TITLE: TextMetrics = { fontSize: 26, lineHeight: 1.25, charWidth: 0.6 }
const ARABIC: TextMetrics = { fontSize: 22, lineHeight: 2.2, charWidth: 0.34 }
const LATIN: TextMetrics = { fontSize: 12.5, lineHeight: 1.8, charWidth: 0.56 }
const TRANSLITERATION: TextMetrics = { fontSize: 12.5, lineHeight: 1.85, charWidth: 0.58 }
const NOTE: TextMetrics = { fontSize: 11.5, lineHeight: 1.7, charWidth: 0.56 }
const NOTES_PADDING_X = 18
const NOTES_BOX_EXTRA = 24 + 18 // top and bottom padding + the space under the box

const ARABIC_STACK = "'MDC Arabic', 'Geeza Pro', 'Noto Naskh Arabic', serif"
const LATIN_STACK = "'MDC Nunito', -apple-system, 'Helvetica Neue', Roboto, Arial, sans-serif"

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const formatDate = (date: Date) => `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`

/** The beads logo as a CSS image, so its outline is in the document once however many pages use it. */
const logoImage = () => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PRAYER_BEADS_VIEWBOX}" height="${PRAYER_BEADS_VIEWBOX}" ` +
    `viewBox="0 0 ${PRAYER_BEADS_VIEWBOX} ${PRAYER_BEADS_VIEWBOX}"><path d="${PRAYER_BEADS_PATH}" fill="${PDF_COLORS.gold}"/></svg>`
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
}

const fontFace = (family: string, base64: string, weight: number, style = 'normal') =>
  `@font-face{font-family:'${family}';src:url(data:font/ttf;base64,${base64}) format('truetype');font-weight:${weight};font-style:${style}}`

function buildStyles({ fonts, unit }: Pick<CollectionPdfInput, 'fonts' | 'unit'>): string {
  const c = PDF_COLORS
  return `
${fontFace('MDC Berkshire', fonts.berkshire, 400)}
${fontFace('MDC Nunito', fonts.nunito, 400)}
${fontFace('MDC Nunito', fonts.nunitoBold, 700)}
${fontFace('MDC Nunito', fonts.nunitoBoldItalic, 700, 'italic')}
${fontFace('MDC Arabic', fonts.arabic, 400)}
:root{--u:${unit}px}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{margin:0}
html,body{margin:0;padding:0;background:#fff}
body{font-family:${LATIN_STACK};font-size:${u(12.5)};line-height:1.8;color:${c.body}}
.page{position:relative;width:${u(PDF_PAGE.width)};height:${u(PAGE_BOX_HEIGHT)};page-break-after:always;break-after:page;background:#fff}
.page:last-child{page-break-after:auto;break-after:auto}
.content{position:absolute;left:${u(MARGIN_X)};width:${u(CONTENT_WIDTH)};top:${u(CONTENT_TOP)}}

.cover{background:${c.coverBackground};overflow:hidden}
.cover-art{position:absolute;left:0;top:0;width:100%;height:100%}
.cover-art svg{display:block;width:100%;height:100%}
.cover-body{position:absolute;left:0;top:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 ${u(60)} ${u(48)} ${u(60)}}
.cover-logo{width:${u(112)};height:${u(112)};background:${logoImage()} center/contain no-repeat;margin-bottom:${u(34)}}
.cover-app{font-family:'MDC Berkshire',Georgia,serif;font-size:${u(34)};line-height:1.2;color:${c.coverText};text-align:center}
.cover-name{font-weight:700;font-size:${u(24)};line-height:1.3;color:${c.softGold};text-align:center;margin-top:${u(18)};max-width:${u(440)}}
.cover-meta{font-size:${u(11)};letter-spacing:0.06em;color:${c.coverMuted};text-align:center;margin-top:${u(16)}}

.label{font-weight:700;font-size:${u(10)};letter-spacing:0.14em;text-transform:uppercase;color:${c.gold};line-height:1.4;margin-bottom:${u(6)}}
.title{font-family:'MDC Berkshire',Georgia,serif;font-weight:400;font-size:${u(TITLE.fontSize)};line-height:${TITLE.lineHeight};color:${c.teal};margin:0 0 ${u(10)} 0}
.rule{width:${u(54)};height:${u(2.5)};background:${c.gold};border-radius:${u(2)};margin-bottom:${u(26)}}
.cont{font-family:'MDC Berkshire',Georgia,serif;font-size:${u(15)};line-height:1.3;color:${c.teal};margin-bottom:${u(8)}}
.cont-rule{width:${u(34)};height:${u(2)};background:${c.gold};margin-bottom:${u(18)}}

.pre{white-space:pre-line}
.arabic{direction:rtl;text-align:justify;text-align-last:right;font-family:${ARABIC_STACK};font-size:${u(ARABIC.fontSize)};line-height:${ARABIC.lineHeight};color:${c.text}}
.translit{font-style:italic;font-weight:700;font-size:${u(TRANSLITERATION.fontSize)};line-height:${TRANSLITERATION.lineHeight};color:${c.body}}
.translation{font-size:${u(LATIN.fontSize)};line-height:${LATIN.lineHeight};color:${c.body}}
.translation.rtl{direction:rtl;text-align:right;font-family:${ARABIC_STACK};font-size:${u(LATIN.fontSize + 2)}}
.meta{font-weight:700;font-size:${u(11.5)};line-height:1.5;color:${c.muted}}
.meta .repeat{color:${c.teal}}

.notes{background:${c.noteBackground};border-left:${u(3)} solid ${c.gold};border-radius:${u(4)};padding:${u(12)} ${u(NOTES_PADDING_X)};margin-bottom:${u(18)}}
.notes > :last-child{margin-bottom:0}
.note-label{font-weight:700;font-size:${u(10)};letter-spacing:0.14em;text-transform:uppercase;color:${c.teal};line-height:1.4;margin-bottom:${u(6)}}
.note{font-size:${u(NOTE.fontSize)};line-height:${NOTE.lineHeight};color:#3A3A3A}
.note.heading{font-weight:700;color:${c.teal}}
.note.bullet{padding-left:${u(12)};text-indent:${u(-12)}}

.footer{position:absolute;left:${u(MARGIN_X)};bottom:${u(36)};display:flex;flex-direction:row;align-items:center}
.footer-logo{width:${u(26)};height:${u(26)};background:${logoImage()} center/contain no-repeat;margin-right:${u(9)}}
.footer-name{font-family:'MDC Berkshire',Georgia,serif;font-size:${u(14)};line-height:1;color:${c.teal}}
.page-no{position:absolute;right:${u(MARGIN_X)};bottom:${u(43)};font-size:${u(11)};line-height:1;color:${c.muted}}
`
}

// ---- cover page -------------------------------------------------------------------------------

function buildCover({ collectionName, duas, t, now = new Date() }: CollectionPdfInput): string {
  const meta = `${t('collection.duaCount', { count: duas.length })} · ${t('export.pdfExported', { date: formatDate(now) })}`
  return `<section class="page cover">
<div class="cover-art">${COVER_ART_SVG}</div>
<div class="cover-body">
<div class="cover-logo"></div>
<div class="cover-app">${escapeHtml(APP_NAME)}</div>
<div class="cover-name">${escapeHtml(collectionName)}</div>
<div class="cover-meta">${escapeHtml(meta)}</div>
</div>
</section>`
}

// ---- one dua ----------------------------------------------------------------------------------

const runsHtml = (block: RichBlock) =>
  block.runs
    .map((run) => {
      let html = escapeHtml(run.text)
      if (run.bold) html = `<b>${html}</b>`
      if (run.italic) html = `<i>${html}</i>`
      return html
    })
    .join('')

/** The notes of a dua (its rich text `info`) as blocks for the notes box. */
function buildNoteBlocks(info: string, t: TFunction): Block[] {
  const paragraphs = parseRichText(info)
  if (paragraphs.length === 0) return []

  const noteWidth = CONTENT_WIDTH - NOTES_PADDING_X - 3
  const label = fixedBlock(`<div class="note-label">${escapeHtml(t('export.pdfNotes'))}</div>`, 10 * 1.4 + 6 + NOTES_BOX_EXTRA, 'notes')

  const blocks = paragraphs.map((paragraph): Block => {
    const isBullet = paragraph.type === 'bullet'
    const plain = (isBullet ? '• ' : '') + paragraph.runs.map((run) => run.text).join('')
    const cssClass = `note pre ${paragraph.type === 'heading' ? 'heading' : isBullet ? 'bullet' : ''}`.trim()
    return textBlock({
      text: plain,
      width: noteWidth,
      metrics: NOTE,
      marginBottom: 8,
      group: 'notes',
      render: (text, marginBottom) => {
        // the original formatting is kept unless the paragraph had to be cut between two pages
        const inner = text === plain ? (isBullet ? '• ' : '') + runsHtml(paragraph) : escapeHtml(text)
        return `<div class="${cssClass}" style="margin-bottom:${u(marginBottom)}">${inner}</div>`
      },
    })
  })
  return [label, ...blocks]
}

function buildDuaUnit(dua: Dua, index: number, total: number, input: CollectionPdfInput): DuaUnit {
  const { collectionName, options, translationLanguage, t } = input
  const title = dua.title.trim() || t('export.pdfUntitled')

  // heading: "COLLECTION · 3 / 12", the title (Berkshire Swash, deep teal) and a short gold rule
  const titleLines = Math.max(1, Math.ceil(title.length / Math.floor(CONTENT_WIDTH / (TITLE.fontSize * TITLE.charWidth))))
  const header = fixedBlock(
    `<div class="label">${escapeHtml(collectionName)} · ${index + 1} / ${total}</div>` +
      `<h2 class="title">${escapeHtml(title)}</h2><div class="rule"></div>`,
    10 * 1.4 + 6 + titleLines * TITLE.fontSize * TITLE.lineHeight + 10 + 2.5 + 26,
  )
  const continuation = fixedBlock(
    `<div class="cont">${escapeHtml(title)} · ${escapeHtml(t('export.pdfContinued'))}</div><div class="cont-rule"></div>`,
    15 * 1.3 + 8 + 2 + 18,
  )

  const blocks: Block[] = []

  // Arabic text: always, in the font chosen in Settings
  blocks.push(
    textBlock({
      text: dua.arabicText,
      width: CONTENT_WIDTH,
      metrics: ARABIC,
      marginBottom: 14,
      render: (text, marginBottom) =>
        `<div class="arabic pre" dir="rtl" lang="ar" style="margin-bottom:${u(marginBottom)}">${escapeHtml(text)}</div>`,
    }),
  )

  const transliteration = dua.transliteration?.trim()
  if (options.transliteration && transliteration) {
    blocks.push(
      textBlock({
        text: transliteration,
        width: CONTENT_WIDTH,
        metrics: TRANSLITERATION,
        marginBottom: 12,
        render: (text, marginBottom) =>
          `<div class="translit pre" style="margin-bottom:${u(marginBottom)}">${escapeHtml(text)}</div>`,
      }),
    )
  }

  const translation = options.translation ? getTranslation(dua, translationLanguage).trim() : ''
  if (translation) {
    const rtl = !!getLanguage(translationLanguage).rtl && !!dua.translations[translationLanguage]
    blocks.push(
      textBlock({
        text: translation,
        width: CONTENT_WIDTH,
        metrics: rtl ? { ...LATIN, fontSize: LATIN.fontSize + 2, charWidth: 0.42 } : LATIN,
        marginBottom: 12,
        render: (text, marginBottom) =>
          `<div class="translation pre${rtl ? ' rtl' : ''}"${rtl ? ' dir="rtl"' : ''} style="margin-bottom:${u(marginBottom)}">${escapeHtml(text)}</div>`,
      }),
    )
  }

  // source line and "Recite N times", on one row
  const sourceLine = options.source ? formatSourceLine(dua) : undefined
  const repeatLine = options.repeat && (dua.repeat ?? 1) > 1 ? t('export.pdfRecite', { count: dua.repeat ?? 1 }) : undefined
  if (sourceLine || repeatLine) {
    const parts = [
      sourceLine ? `<span>${escapeHtml(sourceLine)}</span>` : '',
      repeatLine ? `<span class="repeat">${escapeHtml(repeatLine)}</span>` : '',
    ].filter(Boolean)
    blocks.push(fixedBlock(`<div class="meta" style="margin-bottom:${u(16)}">${parts.join(' · ')}</div>`, 11.5 * 1.5 + 16))
  }

  if (options.notes && dua.info) blocks.push(...buildNoteBlocks(dua.info, t))

  return { header, continuation, blocks }
}

// ---- pages ------------------------------------------------------------------------------------

/** Puts the blocks of a page together, wrapping neighbours of the same group (the notes box) in one element. */
function renderBlocks(blocks: Block[]): string {
  let html = ''
  let openGroup: string | undefined
  for (const block of blocks) {
    if (block.group !== openGroup) {
      if (openGroup) html += '</div>'
      if (block.group) html += `<div class="${block.group}">`
      openGroup = block.group
    }
    html += block.html
  }
  if (openGroup) html += '</div>'
  return html
}

function renderPage(page: PageContent, pageNumber: number): string {
  return `<section class="page">
<div class="content">${renderBlocks(page.blocks)}</div>
<div class="footer"><div class="footer-logo"></div><div class="footer-name">${escapeHtml(APP_NAME)}</div></div>
<div class="page-no">${pageNumber}</div>
</section>`
}

/**
 * The whole PDF as one HTML document: an optional cover page, then the duas, one after the other, each
 * page with the logo and app name at the bottom left and its number at the bottom right.
 */
export function buildCollectionPdfHtml(input: CollectionPdfInput): string {
  const { duas, options } = input
  const units = duas.map((dua, index) => buildDuaUnit(dua, index, duas.length, input))
  const pages = paginate(units, options.onePerPage)

  const body = [
    options.coverPage ? buildCover(input) : '',
    ...pages.map((page, index) => renderPage(page, index + 1)),
  ].join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>${escapeHtml(input.collectionName)}</title>
<style>${buildStyles(input)}</style>
</head>
<body>
${body}
</body>
</html>`
}
