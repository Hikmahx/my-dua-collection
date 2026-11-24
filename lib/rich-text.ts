export interface RichRun {
  text: string
  bold?: boolean
  italic?: boolean
}

export interface RichBlock {
  type: 'paragraph' | 'heading' | 'bullet'
  runs: RichRun[]
}

/** The named entities an editor or a paste is likely to produce. Numeric ones (`&#39;`, `&#x27;`, `&#8217;`) are handled by their code. */
const NAMED_ENTITIES = new Map<string, string>([
  ['amp', '&'],
  ['lt', '<'],
  ['gt', '>'],
  ['quot', '"'],
  ['apos', "'"],
  ['nbsp', ' '],
  ['lsquo', '\u2018'],
  ['rsquo', '\u2019'],
  ['ldquo', '\u201C'],
  ['rdquo', '\u201D'],
  ['ndash', '\u2013'],
  ['mdash', '\u2014'],
  ['hellip', '\u2026'],
])

/**
 * Turns HTML entities back into text, in one pass (so `&amp;lt;` becomes `&lt;`, not `<`).
 * Handles named, decimal (`&#8217;`) and hex (`&#x27;`) entities. Anything unknown, or a number
 * that is not a real character, is left as written.
 */
export function decodeEntities(text: string): string {
  return text.replace(/&(?:#(\d{1,7})|#[xX]([0-9a-fA-F]{1,6})|([a-zA-Z][a-zA-Z0-9]{1,9}));/g, (match, dec, hex, name) => {
    if (name) return NAMED_ENTITIES.get(name) ?? NAMED_ENTITIES.get(name.toLowerCase()) ?? match
    const code = dec ? parseInt(dec, 10) : parseInt(hex, 16)
    const isSurrogate = code >= 0xd800 && code <= 0xdfff
    if (code === 0 || code > 0x10ffff || isSurrogate) return match
    return String.fromCodePoint(code)
  })
}

/**
 * Turns the HTML a dua's `info` is stored as (from the rich editor) into plain blocks: paragraphs,
 * headings and bullets, with bold / italic runs. Only these few tags are understood; every other
 * tag and every attribute is dropped, so nothing from the HTML can run or load. This is the
 * "sanitize before rendering" step.
 */
export function parseRichText(html: string): RichBlock[] {
  const blocks: RichBlock[] = []
  let current: RichBlock | null = null
  let bold = 0
  let italic = 0

  const open = (type: RichBlock['type']) => {
    current = { type, runs: [] }
    blocks.push(current)
  }

  for (const token of html.match(/<[^>]*>|[^<]+/g) ?? []) {
    if (token.startsWith('<')) {
      const match = /^<\s*(\/?)\s*([a-z0-9]+)/i.exec(token)
      if (!match) continue
      const closing = match[1] === '/'
      const tag = match[2].toLowerCase()

      if (tag === 'b' || tag === 'strong') bold = Math.max(0, bold + (closing ? -1 : 1))
      else if (tag === 'i' || tag === 'em') italic = Math.max(0, italic + (closing ? -1 : 1))
      else if (/^h[1-6]$/.test(tag)) {
        current = null
        if (!closing) open('heading')
      } else if (tag === 'li') {
        current = null
        if (!closing) open('bullet')
      } else if (tag === 'br' || tag === 'p' || tag === 'div' || tag === 'ul' || tag === 'ol') {
        current = null
      }
    } else {
      const text = decodeEntities(token).replace(/\s+/g, ' ')
      if (!text.trim() && !current) continue
      if (!current) open('paragraph')
      current!.runs.push({ text, bold: bold > 0, italic: italic > 0 })
    }
  }

  return blocks
    .map((block) => {
      const runs = block.runs.map((run) => ({ ...run }))
      if (runs.length) {
        runs[0].text = runs[0].text.trimStart()
        runs[runs.length - 1].text = runs[runs.length - 1].text.trimEnd()
      }
      return { ...block, runs: runs.filter((run) => run.text) }
    })
    .filter((block) => block.runs.length > 0)
}

/**
 * Plain text the user typed (a note) as the HTML a dua's `info` is stored as: one paragraph per line, with the
 * characters HTML treats specially written as entities, so the text is shown exactly as typed.
 */
export function plainTextToInfo(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
    .join('')
}
