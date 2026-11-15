import { matchesSearch } from '@/lib/search'
import { useMemo, useState } from 'react'

/**
 * The one search hook for the whole app: keeps the query and filters a list by it.
 * `getFields` says which text of an item is searchable, e.g. (dua) => [dua.title, dua.arabicText].
 * Define it outside the component (or memoise it) so results aren't recomputed on every render.
 */
export function useSearch<T>(items: T[], getFields: (item: T) => (string | undefined)[]) {
  const [query, setQuery] = useState('')
  const isSearching = query.trim().length > 0

  const results = useMemo(
    () => (isSearching ? items.filter((item) => matchesSearch(query, getFields(item))) : items),
    [items, query, isSearching, getFields],
  )

  return { query, setQuery, results, isSearching }
}
