import type { Dua } from '@/redux/reducers/duasSlice'

/**
 * The ids of the favorite duas in the order the user arranged them. `order` is the saved order:
 * ids in it that are no longer favorites (or appear twice) are dropped, and favorites missing from
 * it (just favorited, or never ordered) go at the end in the order of `duas`.
 */
export function normalizeFavoriteOrder(duas: Dua[], order: string[]): string[] {
  const favorites = new Set<string>()
  for (const dua of duas) if (dua.isFavorite) favorites.add(dua.id)

  const result: string[] = []
  const seen = new Set<string>()
  for (const id of order) {
    if (favorites.has(id) && !seen.has(id)) {
      seen.add(id)
      result.push(id)
    }
  }
  for (const dua of duas) {
    if (dua.isFavorite && !seen.has(dua.id)) {
      seen.add(dua.id)
      result.push(dua.id)
    }
  }
  return result
}

/** The favorite duas in the user's order (what the Favorites screen lists and the Dua screen swipes through). */
export function getFavoriteDuas(duas: Dua[], order: string[]): Dua[] {
  const byId = new Map(duas.map((dua) => [dua.id, dua]))
  return normalizeFavoriteOrder(duas, order).flatMap((id) => {
    const dua = byId.get(id)
    return dua ? [dua] : []
  })
}
