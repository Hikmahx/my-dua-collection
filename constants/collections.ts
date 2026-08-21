import type { CollectionIconKey } from '@/components/icons/CollectionIcons'

export interface CollectionDef {
  id: string
  name: string
  iconKey: CollectionIconKey
  isUserCreated?: boolean
}

/** Collection definitions: category id -> display name and icon. Used for home grid. */
export const COLLECTION_DEFS: CollectionDef[] = [
  { id: 'Quranic', name: 'Quranic Duas', iconKey: 'book' },
  { id: 'Morning', name: 'Morning', iconKey: 'sun' },
  { id: 'Evening', name: 'Evening', iconKey: 'moon' },
  { id: 'Night', name: 'Tahajjud', iconKey: 'lamp' },
  { id: 'General', name: 'The Power of...', iconKey: 'journal' },
  { id: 'Prayer', name: 'After Prayer', iconKey: 'hands' },
]
