import {
  listSourceNames,
  matchesSourceFilter,
  type SourceFilter,
} from '@/lib/dua-utils'
import type { FilterMenuSection } from '@/lib/types'
import type { Dua } from '@/redux/reducers/duasSlice'
import { useMemo, useState } from 'react'

/**
 * Filter a list of duas by surah or hadith name (one at a time). Returns the filtered duas and
 * the "Surah" / "Hadith" sections for the filter menu. A section only appears when the list has
 * duas from it. Tap the selected option again to clear the filter.
 */
export function useSourceFilter(duas: Dua[]) {
  const [selected, setSelected] = useState<SourceFilter | null>(null)
  const { surahs, hadiths } = useMemo(() => listSourceNames(duas), [duas])

  // Forget a filter whose duas are gone (e.g. the last one was un-favorited)
  const filter =
    selected && (selected.kind === 'surah' ? surahs : hadiths).includes(selected.name)
      ? selected
      : null

  const filtered = useMemo(
    () => (filter ? duas.filter((dua) => matchesSourceFilter(dua, filter)) : duas),
    [duas, filter],
  )

  const sections = useMemo(() => {
    const section = (kind: SourceFilter['kind'], title: string, names: string[]): FilterMenuSection => ({
      id: kind,
      title,
      options: names.map((name) => {
        const isSelected = filter?.kind === kind && filter.name === name
        return {
          id: `${kind}-${name}`,
          label: name,
          selected: isSelected,
          onSelect: () => setSelected(isSelected ? null : { kind, name }),
        }
      }),
    })

    const result: FilterMenuSection[] = []
    if (surahs.length > 0) result.push(section('surah', 'Surah', surahs))
    if (hadiths.length > 0) result.push(section('hadith', 'Hadith', hadiths))
    return result
  }, [surahs, hadiths, filter])

  return { filter, filtered, sections }
}
