import { PDF_PAGE, u } from '@/lib/pdf/pdf-config'

/**
 * Page layout for the PDF. All lengths are in layout units (points on an A4 page, see pdf-config.ts).
 *
 * The HTML engines that print the PDF cannot tell us where a page ends, so the pages are filled here: every
 * piece of a dua is a "block" with an estimated height, and blocks are placed page by page. The estimates
 * lean tall on purpose. A page that ends a little early is harmless; one that overflows would push its
 * footer onto the next page.
 */

export const MARGIN_X = 58
export const CONTENT_WIDTH = PDF_PAGE.width - MARGIN_X * 2
export const CONTENT_TOP = 62
/** Room kept free at the bottom of every page for the footer (logo, app name, page number). */
export const FOOTER_ZONE = 92
/** One unit shorter than the sheet, so rounding never pushes a page onto a second sheet. */
export const PAGE_BOX_HEIGHT = PDF_PAGE.height - 1
export const CONTENT_HEIGHT = PAGE_BOX_HEIGHT - CONTENT_TOP - FOOTER_ZONE

/** The estimated heights are multiplied by this, to stay on the safe side. */
const SAFETY = 1.1
/** Space between two duas that share a page (when "One dua per page" is off). */
export const DUA_GAP = 30
/** A dua longer than a page is only started on a page that has room for its heading and this much of its first block. */
const MIN_FIRST_BLOCK = 110

export interface TextMetrics {
  /** Font size in units. */
  fontSize: number
  /** Line height as a multiple of the font size. */
  lineHeight: number
  /** Average width of one character as a multiple of the font size (wide on purpose). */
  charWidth: number
}

/** A piece of a page: its markup and how tall it is. */
export interface Block {
  html: string
  /** Estimated height including the space under it. */
  height: number
  /** Neighbouring blocks with the same group are wrapped together (the notes box). */
  group?: 'notes'
  /** Cuts the block so the first part is at most `maxHeight` tall. Missing when the block cannot be split. */
  split?: (maxHeight: number) => { head: Block; tail: Block } | null
}

/** One dua, ready to be placed. */
export interface DuaUnit {
  /** The heading: label, title and the rule under it. */
  header: Block
  /** The short heading put on top of a following page when the dua runs on. */
  continuation: Block
  blocks: Block[]
}

export interface PageContent {
  blocks: Block[]
}

export const charsPerLine = (width: number, metrics: TextMetrics) =>
  Math.max(1, Math.floor(width / (metrics.fontSize * metrics.charWidth)))

/** Number of lines the text takes: each paragraph (line break) starts a new line. */
export function estimateLines(text: string, perLine: number): number {
  return text.split('\n').reduce((total, paragraph) => total + Math.max(1, Math.ceil(paragraph.length / perLine)), 0)
}

export const estimateTextHeight = (text: string, width: number, metrics: TextMetrics): number =>
  estimateLines(text, charsPerLine(width, metrics)) * metrics.fontSize * metrics.lineHeight * SAFETY

/**
 * Cuts `text` after at most `maxLines` lines, at a line break or a space. Returns the two parts, or null
 * when nothing sensible can be cut off (the first part would be empty, or the text already fits).
 */
export function cutText(text: string, perLine: number, maxLines: number): [string, string] | null {
  const paragraphs = text.split('\n')
  const head: string[] = []
  let used = 0

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]
    const lines = Math.max(1, Math.ceil(paragraph.length / perLine))

    if (used + lines <= maxLines) {
      head.push(paragraph)
      used += lines
      continue
    }

    const room = maxLines - used
    if (room >= 1 && paragraph.length > perLine) {
      // the paragraph is cut in the middle, at the last space that still fits
      const limit = room * perLine
      let cut = paragraph.lastIndexOf(' ', limit)
      if (cut < limit * 0.4) cut = limit
      head.push(paragraph.slice(0, cut).trimEnd())
      const rest = [paragraph.slice(cut).trimStart(), ...paragraphs.slice(i + 1)]
      return [head.join('\n'), rest.join('\n')]
    }

    // the whole paragraph moves to the next page
    if (head.length === 0) return null
    return [head.join('\n'), paragraphs.slice(i).join('\n')]
  }

  return null
}

interface TextBlockOptions {
  text: string
  width: number
  metrics: TextMetrics
  /** Space under the block. */
  marginBottom: number
  /** Markup of a piece of the text, with `marginBottom` under it (it has to escape the text itself). */
  render: (text: string, marginBottom: number) => string
  group?: Block['group']
  /** Fewest lines worth leaving at the bottom of a page when the block is split. */
  minLines?: number
}

/** A block of running text that can be split between pages. */
export function textBlock(options: TextBlockOptions): Block {
  const { text, width, metrics, marginBottom, render, group, minLines = 2 } = options
  const perLine = charsPerLine(width, metrics)
  const lineHeight = metrics.fontSize * metrics.lineHeight * SAFETY

  return {
    html: render(text, marginBottom),
    group,
    height: estimateLines(text, perLine) * lineHeight + marginBottom,
    split: (maxHeight) => {
      const maxLines = Math.floor((maxHeight - marginBottom) / lineHeight)
      if (maxLines < minLines) return null
      const parts = cutText(text, perLine, maxLines)
      if (!parts) return null
      const [first, rest] = parts
      if (!first.trim() || !rest.trim()) return null
      // the first part ends the page, so it has no space under it
      const head = textBlock({ ...options, text: first, marginBottom: 0 })
      const tail = textBlock({ ...options, text: rest })
      return { head, tail }
    },
  }
}

/** A block that cannot be split (a heading or a one-line row). */
export const fixedBlock = (html: string, height: number, group?: Block['group']): Block => ({
  html,
  height: height * SAFETY,
  group,
})

interface PageBuilder {
  blocks: Block[]
  used: number
  /** True once something other than a heading is on the page. */
  hasBody: boolean
}

const emptyPage = (): PageBuilder => ({ blocks: [], used: 0, hasBody: false })

/**
 * Places the duas on pages. With `onePerPage` every dua starts a new page; otherwise it follows the previous
 * dua when its heading and the start of its text fit. A dua that is longer than a page runs on to the next
 * page(s) under a short "continued" heading.
 */
export function paginate(units: DuaUnit[], onePerPage: boolean): PageContent[] {
  const pages: PageBuilder[] = []
  let page = emptyPage()

  const add = (block: Block, body: boolean) => {
    page.blocks.push(block)
    page.used += block.height
    if (body) page.hasBody = true
  }
  const nextPage = () => {
    if (page.blocks.length) pages.push(page)
    page = emptyPage()
  }

  for (const unit of units) {
    const firstHeight = Math.min(unit.blocks[0]?.height ?? 0, MIN_FIRST_BLOCK)
    const totalHeight = unit.blocks.reduce((sum, block) => sum + block.height, unit.header.height)
    const room = CONTENT_HEIGHT - page.used
    // a dua that fits on one page is never cut: if it does not fit in what is left here, it starts the next page
    const needed = totalHeight <= CONTENT_HEIGHT ? totalHeight : unit.header.height + firstHeight

    if (page.blocks.length > 0) {
      if (onePerPage || room < needed + DUA_GAP) nextPage()
      else add(fixedBlock(`<div style="height:${u(DUA_GAP)}"></div>`, DUA_GAP / SAFETY), false)
    }
    add(unit.header, false)

    const queue = [...unit.blocks]
    while (queue.length > 0) {
      const block = queue.shift() as Block
      const room = CONTENT_HEIGHT - page.used

      if (block.height <= room) {
        add(block, true)
        continue
      }

      const parts = block.split?.(room)
      if (parts) {
        add(parts.head, true)
        queue.unshift(parts.tail)
        nextPage()
        add(unit.continuation, false)
        continue
      }

      if (!page.hasBody) {
        // nothing fits better on a fresh page, so it goes here, even if it overflows a little
        add(block, true)
        continue
      }

      queue.unshift(block)
      nextPage()
      add(unit.continuation, false)
    }
  }

  nextPage()
  return pages.map(({ blocks }) => ({ blocks }))
}
