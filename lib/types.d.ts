import type { MaterialCommunityIcons } from '@expo/vector-icons'

export type FilterMenuIconName = keyof typeof MaterialCommunityIcons.glyphMap

export interface FilterMenuOption {
  id: string
  label: string
  icon?: FilterMenuIconName
  selected?: boolean
  onSelect: () => void
}

/** A labelled run of options inside a section (e.g. "Surah" and "Hadith" under "Filter"). */
export interface FilterMenuGroup {
  id: string
  title: string
  options: FilterMenuOption[]
}

/** One titled group of options. Add a new section object to grow the menu. */
export interface FilterMenuSection {
  id: string
  title: string
  /** Options shown directly under the title. */
  options?: FilterMenuOption[]
  /** Labelled sub-groups shown under the title, instead of or after `options`. */
  groups?: FilterMenuGroup[]
  /** Caps the section's height. Past it, the section scrolls on its own. */
  maxHeight?: number
}

export interface FilterMenuAnchor {
  x: number
  y: number
  width: number
  height: number
}

export interface FilterMenuProps {
  visible: boolean
  anchor: FilterMenuAnchor | null
  sections: FilterMenuSection[]
  onClose: () => void
  closeOnSelect?: boolean
}
