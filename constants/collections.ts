import type { CollectionIconKey } from '@/components/icons/collection-icons'
import { data } from '@/data'

export interface CollectionDef {
  id: string
  name: string
  iconKey: CollectionIconKey
  isUserCreated?: boolean
  /** Id of the user who shared this collection. Missing (or null) when the user made it themselves. */
  sharedBy?: string | null
}

/** Collection definitions: category id -> display name and icon. Used for home grid. Read from data/collection.json. */
export const COLLECTION_DEFS: CollectionDef[] = data.collections

/** Display name of a collection (category) id. Unknown ids are shown as they are. */
export const getCollectionName = (id: string) =>
  COLLECTION_DEFS.find((c) => c.id === id)?.name ?? id
