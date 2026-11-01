import type { MaterialCommunityIcons } from '@expo/vector-icons'

export type FilterMenuIconName = keyof typeof MaterialCommunityIcons.glyphMap

export interface FilterMenuOption {
  id: string
  label: string
  icon?: FilterMenuIconName
  selected?: boolean
  onSelect: () => void
}

/** One titled group of options. Add a new section object to grow the menu. */
export interface FilterMenuSection {
  id: string
  title: string
  options: FilterMenuOption[]
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
