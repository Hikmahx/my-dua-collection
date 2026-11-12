import type { LineIconKey } from '@/components/icons/collection-icons'

export interface ExploreTopic {
  id: string
  label: string
  iconKey: LineIconKey
}

/** Explore grid, in reading order (3 per row). Alternating cell shades follow this order. */
export const EXPLORE_TOPICS: ExploreTopic[] = [
  { id: 'ask-duaai', label: 'Ask DuaAI', iconKey: 'chat-sparkle' },
  { id: 'names-of-allah', label: 'Names of Allah', iconKey: 'star-pillars' },
  { id: 'sunnah', label: 'Sunnah', iconKey: 'open-book' },
  { id: 'tahajjud', label: 'Tahajjud', iconKey: 'moon-sparkle' },
  { id: 'hajj-umrah', label: 'Hajj & Umrah', iconKey: 'kaaba' },
  { id: 'ramadan-fasting', label: 'Ramadan & other fasting', iconKey: 'crescent-cup' },
  { id: 'hijamah', label: 'Hijamah', iconKey: 'cupping-cup' },
  { id: 'tawakkul-yaqeen', label: 'Tawakkul & Yaqeen', iconKey: 'heart-check' },
  { id: 'habits-life', label: 'Habits and Life', iconKey: 'checklist' },
]
