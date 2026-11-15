import { COMPLETION_FEEDBACK_COUNT } from '@/constants/tasbih-config'
import { DEFAULT_DHIKR_ID, TASBIH_PRESET_IDS } from '@/constants/tasbih-presets'
import { getTranslation } from '@/lib/dua-utils'
import type { Dua } from '@/redux/reducers/duasSlice'

/** What the Tasbih screen shows for the dua being counted (a dua from data.json). */
export interface TasbihItem {
  id: string // the dua's id
  title: string
  arabic: string
  transliteration: string // '' when the dua has none
  translation: string
}

export function duaToTasbihItem(dua: Dua, language: string): TasbihItem {
  return {
    id: dua.id,
    title: dua.title,
    arabic: dua.arabicText,
    transliteration: dua.transliteration ?? '',
    translation: getTranslation(dua, language),
  }
}

const EMPTY_ITEM: TasbihItem = { id: '', title: '', arabic: '', transliteration: '', translation: '' }

/** The dua with this id; falls back to the default dhikr (or the first dua) if it no longer exists. */
export function findTasbihItem(id: string, duas: Dua[], language: string): TasbihItem {
  const dua =
    duas.find((d) => d.id === id) ?? duas.find((d) => d.id === DEFAULT_DHIKR_ID) ?? duas[0]
  return dua ? duaToTasbihItem(dua, language) : EMPTY_ITEM
}

/** The preset duas (TASBIH_PRESET_IDS) shown in the picker before the user searches. */
export function getPresetItems(duas: Dua[], language: string): TasbihItem[] {
  return TASBIH_PRESET_IDS.flatMap((id) => {
    const dua = duas.find((d) => d.id === id)
    return dua ? [duaToTasbihItem(dua, language)] : []
  })
}

/** Longer duas (e.g. Quranic verses) get a smaller Arabic size so more of them fits. */
export const tasbihArabicSize = (text: string) =>
  text.length <= 30 ? 30 : text.length <= 80 ? 24 : text.length <= 150 ? 20 : 17

/** 0–1, stops at full once the target is reached. */
export const tasbihProgress = (count: number, target: number) =>
  target > 0 ? Math.min(count / target, 1) : 0

/** True for the tap that reaches the target and the following ones (see COMPLETION_FEEDBACK_COUNT). */
export const isCompletionCount = (count: number, target: number) =>
  count >= target && count < target + COMPLETION_FEEDBACK_COUNT
