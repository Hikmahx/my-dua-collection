/*
 * The maths behind a drag-to-reorder list of rows that all have the same height. These run on the
 * UI thread while a row is being dragged (hence the 'worklet' lines), so they only use plain values.
 */

/** Where each row is: id -> index (0 is the top row). */
export type Positions = Record<string, number>

export function positionsFromIds(ids: string[]): Positions {
  const positions: Positions = {}
  ids.forEach((id, index) => {
    positions[id] = index
  })
  return positions
}

/** The ids from top to bottom. */
export function idsFromPositions(positions: Positions): string[] {
  'worklet'
  return Object.keys(positions).sort((a, b) => positions[a] - positions[b])
}

/** The row index a row sits at when its top edge is `offsetY` below the top of the list. */
export function indexFromOffset(offsetY: number, pitch: number, count: number): number {
  'worklet'
  const index = Math.round(offsetY / pitch)
  return Math.min(Math.max(index, 0), Math.max(count - 1, 0))
}

/** Puts row `id` at `newIndex`; the rows in between each move one place. */
export function moveTo(positions: Positions, id: string, newIndex: number): Positions {
  'worklet'
  const oldIndex = positions[id]
  if (oldIndex === undefined || oldIndex === newIndex) return positions
  const next: Positions = {}
  for (const key in positions) {
    const index = positions[key]
    if (key === id) next[key] = newIndex
    else if (oldIndex < newIndex && index > oldIndex && index <= newIndex) next[key] = index - 1
    else if (oldIndex > newIndex && index >= newIndex && index < oldIndex) next[key] = index + 1
    else next[key] = index
  }
  return next
}

/** A copy of `list` with the item at `from` moved to `to`. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || from >= list.length || to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

/**
 * How far to scroll (per frame) while a row is dragged near the top or bottom of the list:
 * negative scrolls up, positive scrolls down, and it speeds up the closer the finger is to the edge.
 */
export function autoScrollDelta(
  fingerY: number,
  viewTop: number,
  viewBottom: number,
  edge = 56,
  maxSpeed = 14,
): number {
  'worklet'
  if (fingerY < viewTop + edge) return -maxSpeed * Math.min(1, (viewTop + edge - fingerY) / edge)
  if (fingerY > viewBottom - edge) return maxSpeed * Math.min(1, (fingerY - (viewBottom - edge)) / edge)
  return 0
}
