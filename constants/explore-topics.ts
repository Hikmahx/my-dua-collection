import type { ExploreIconKey } from '@/components/icons/explore-topic-icons'

export interface ExploreTopic {
  id: string
  label: string
  iconKey: ExploreIconKey
}

/** Explore grid, in reading order (3 per row). Alternating cell shades follow this order. */
export const EXPLORE_TOPICS: ExploreTopic[] = [
  { id: 'ask-duaai', label: 'Ask DuaAI', iconKey: 'askduaai' },
  { id: 'names-of-allah', label: 'Names of Allah', iconKey: 'namesofallah' },
  { id: 'sunnah', label: 'Sunnah', iconKey: 'sunnah' },
  { id: 'tahajjud', label: 'Tahajjud', iconKey: 'tahajjud' },
  { id: 'hajj-umrah', label: 'Hajj & Umrah', iconKey: 'kabbah' },
  { id: 'ramadan-fasting', label: 'Ramadan & other fasting', iconKey: 'fasting' },
  { id: 'hijamah', label: 'Hijamah', iconKey: 'hijamah' },
  { id: 'tawakkul-yaqeen', label: 'Tawakkul & Yaqeen', iconKey: 'tawakkulyaqeen' },
  { id: 'habits-life', label: 'Habits and Life', iconKey: 'habitsandlife' },
]
