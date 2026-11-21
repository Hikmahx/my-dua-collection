import type { LineIconKey } from '@/components/icons/collection-icons'

/**
 * What opening a topic does:
 *  - 'chat'     the Ask DuaAI chat
 *  - 'names'    the 99 Names of Allah: each row shows the Arabic name on the right
 *  - 'articles' a list of short articles: each row has a chevron
 */
export type ExploreTopicKind = 'chat' | 'names' | 'articles'

export interface ExploreTopic {
  id: string
  /** The label on the Explore grid. */
  label: string
  iconKey: LineIconKey
  kind: ExploreTopicKind
  /** The header of the topic screen, when it differs from the grid label. */
  title?: string
  /** Placeholder of the search box on the topic screen. */
  searchPlaceholder?: string
}

/** Explore grid, in reading order (3 per row). Alternating cell shades follow this order. */
export const EXPLORE_TOPICS: ExploreTopic[] = [
  { id: 'ask-duaai', label: 'Ask DuaAI', iconKey: 'chat-sparkle', kind: 'chat' },
  {
    id: 'names-of-allah',
    label: 'Names of Allah',
    iconKey: 'star-pillars',
    kind: 'names',
    title: '99 Names of Allah',
    searchPlaceholder: 'Search names',
  },
  { id: 'sunnah', label: 'Sunnah', iconKey: 'open-book', kind: 'articles', searchPlaceholder: 'Search sunnah' },
  { id: 'tahajjud', label: 'Tahajjud', iconKey: 'moon-sparkle', kind: 'articles', searchPlaceholder: 'Search tahajjud' },
  {
    id: 'hajj-umrah',
    label: 'Hajj & Umrah',
    iconKey: 'kaaba',
    kind: 'articles',
    searchPlaceholder: 'Search hajj & umrah',
  },
  {
    id: 'ramadan-fasting',
    label: 'Ramadan & other fasting',
    iconKey: 'crescent-cup',
    kind: 'articles',
    title: 'Ramadan & Fasting',
    searchPlaceholder: 'Search fasting',
  },
  { id: 'hijamah', label: 'Hijamah', iconKey: 'cupping-cup', kind: 'articles', searchPlaceholder: 'Search hijamah' },
  {
    id: 'tawakkul-yaqeen',
    label: 'Tawakkul & Yaqeen',
    iconKey: 'heart-check',
    kind: 'articles',
    searchPlaceholder: 'Search tawakkul & yaqeen',
  },
  {
    id: 'habits-life',
    label: 'Habits and Life',
    iconKey: 'checklist',
    kind: 'articles',
    searchPlaceholder: 'Search habits',
  },
]

export const getExploreTopic = (id: string | undefined) => EXPLORE_TOPICS.find((topic) => topic.id === id)
