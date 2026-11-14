import { COMPLETION_FEEDBACK_COUNT } from '@/constants/tasbih-config'
import { TASBIH_PRESETS } from '@/constants/tasbih-presets'
import { getTranslation } from '@/lib/dua-utils'
import type { Dua } from '@/redux/reducers/duasSlice'

/** Anything the counter can count: a preset dhikr or one of the user's duas. */
export interface TasbihItem {
  id: string // 'preset:…' or 'dua:<dua id>'
  arabic: string
  transliteration: string
  translation: string
}

export function duaToTasbihItem(dua: Dua, language: string): TasbihItem {
  return {
    id: `dua:${dua.id}`,
    arabic: dua.arabicText,
    transliteration: dua.transliteration || dua.title,
    translation: getTranslation(dua, language),
  }
}

/** Looks the id up in the presets, then in the duas; falls back to the first preset. */
export function findTasbihItem(id: string, duas: Dua[], language: string): TasbihItem {
  const preset = TASBIH_PRESETS.find((p) => p.id === id)
  if (preset) return preset
  const dua = duas.find((d) => `dua:${d.id}` === id)
  return dua ? duaToTasbihItem(dua, language) : TASBIH_PRESETS[0]
}

/** Empty query → the preset list. Otherwise searches the presets AND every dua, whatever its collection. */
export function searchTasbihItems(query: string, duas: Dua[], language: string): TasbihItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return TASBIH_PRESETS

  const all = [...TASBIH_PRESETS, ...duas.map((d) => duaToTasbihItem(d, language))]
  const titles = new Map(duas.map((d) => [`dua:${d.id}`, d.title.toLowerCase()]))
  return all.filter(
    (item) =>
      item.transliteration.toLowerCase().includes(q) ||
      item.translation.toLowerCase().includes(q) ||
      item.arabic.includes(query.trim()) ||
      titles.get(item.id)?.includes(q),
  )
}

/** 0–1, stops at full once the target is reached. */
export const tasbihProgress = (count: number, target: number) =>
  target > 0 ? Math.min(count / target, 1) : 0

/** True for the tap that reaches the target and the following ones (see COMPLETION_FEEDBACK_COUNT). */
export const isCompletionCount = (count: number, target: number) =>
  count >= target && count < target + COMPLETION_FEEDBACK_COUNT
