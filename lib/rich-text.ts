export interface RichRun {
  text: string
  bold?: boolean
  italic?: boolean
}

export interface RichBlock {
  type: 'paragraph' | 'heading' | 'bullet'
  runs: RichRun[]
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
}
const decode = (text: string) => text.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (match) => ENTITIES[match])

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
      const text = decode(token).replace(/\s+/g, ' ')
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
