import type { CollectionIconKey } from '@/components/icons/collection-icons'
import { data } from '@/data'

export interface CollectionDef {
  id: string
  name: string
  iconKey: CollectionIconKey
  isUserCreated?: boolean
  /**
   * The duas of a collection the user made, in the order they are shown. Pre-made collections have
   * no list: their duas are the ones that name the collection in their `categories`.
   */
  duaIds?: string[]
  /** Id of the user who shared this collection. Missing (or null) when the user made it themselves. */
  sharedBy?: string | null
}

/** Collection definitions: category id -> display name and icon. Used for home grid. Read from data/collection.json. */
export const COLLECTION_DEFS: CollectionDef[] = data.collections

/** A collection the user made (or received). The only kind that can be edited or deleted. */
export type UserCollection = CollectionDef & { isUserCreated: true; duaIds: string[] }

/**
 * Display name of a collection (category) id. Pass the user's own collections to find theirs too.
 * Unknown ids are shown as they are.
 */
export const getCollectionName = (id: string, userCollections: CollectionDef[] = []) =>
  COLLECTION_DEFS.find((c) => c.id === id)?.name ?? userCollections.find((c) => c.id === id)?.name ?? id

/** Longest name a collection the user makes can have (the add-dua form, the sidebar and Edit collection). */
export const MAX_COLLECTION_NAME_LENGTH = 40

/** Icon of a collection created from the add-dua form or the Dua screen's sidebar. */
export const NEW_COLLECTION_ICON_KEY: CollectionIconKey = 'journal'
