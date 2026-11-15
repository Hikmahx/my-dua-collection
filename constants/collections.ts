import type { CollectionIconKey } from '@/components/icons/collection-icons'

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
  { id: 'Dhikr', name: 'Dhikr', iconKey: 'heart-check' },
]

/** Display name of a collection (category) id. Unknown ids are shown as they are. */
export const getCollectionName = (id: string) =>
  COLLECTION_DEFS.find((c) => c.id === id)?.name ?? id
