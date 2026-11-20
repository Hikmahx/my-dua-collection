import { useT } from '@/hooks/use-t'
import {
  listSourceNames,
  matchesSourceFilter,
  type SourceFilter,
} from '@/lib/dua-utils'
import type { FilterMenuGroup, FilterMenuSection } from '@/lib/types'
import type { Dua } from '@/redux/reducers/duasSlice'
import { useMemo, useState } from 'react'

/** Tallest the Surah / Hadith filter gets (about five rows) before it scrolls. */
const FILTER_MAX_HEIGHT = 240

/**
 * Filter a list of duas by surah or hadith name (one at a time). Returns the filtered duas and
 * one menu section: "Filter" with Surah and Hadith groups when the list has both, or just
 * "Surah" or "Hadith" when it has only one of them (nothing when it has neither). Tap the selected option again to clear the filter.
 */
export function useSourceFilter(duas: Dua[]) {
  const [selected, setSelected] = useState<SourceFilter | null>(null)
  const t = useT()
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
    const group = (kind: SourceFilter['kind'], title: string, names: string[]): FilterMenuGroup => ({
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

    const groups: FilterMenuGroup[] = []
    if (surahs.length > 0) groups.push(group('surah', t('filter.surah'), surahs))
    if (hadiths.length > 0) groups.push(group('hadith', t('filter.hadith'), hadiths))
    if (groups.length === 0) return []

    // Only one kind: the section is named after it ("Surah" or "Hadith"), with no group label.
    // More than one kind: a "Filter" section with a labelled group for each. Both are capped in
    // height, so a long list scrolls on its own.
    const [only] = groups
    const section: FilterMenuSection =
      groups.length === 1
        ? { id: only.id, title: only.title, options: only.options, maxHeight: FILTER_MAX_HEIGHT }
        : { id: 'filter', title: t('filter.title'), groups, maxHeight: FILTER_MAX_HEIGHT }
    return [section]
  }, [surahs, hadiths, filter, t])

  return { filter, filtered, sections }
}
