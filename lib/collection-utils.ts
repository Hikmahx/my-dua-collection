import { COLLECTION_DEFS, type CollectionDef, type UserCollection } from '@/constants/collections'
import type { Dua } from '@/redux/reducers/duasSlice'

/** Pre-made collections followed by the ones the user made. */
export const getAllCollections = (userCollections: UserCollection[]): CollectionDef[] => [
  ...COLLECTION_DEFS,
  ...userCollections,
]

/** Only collections the user made can be edited or deleted. */
export const isEditableCollection = (collection?: CollectionDef): collection is UserCollection =>
  !!collection?.isUserCreated && Array.isArray(collection.duaIds)

/**
 * The duas of a collection, in the order to show them.
 * - A collection the user made lists its duas itself, in the order they chose (a dua that no longer
 *   exists is skipped).
 * - A pre-made collection holds the duas that name it in their `categories`.
 */
export function getDuasInCollection(id: string, duas: Dua[], userCollections: UserCollection[]): Dua[] {
  const own = userCollections.find((collection) => collection.id === id)
  if (!own) return duas.filter((dua) => dua.categories.includes(id))
  const byId = new Map(duas.map((dua) => [dua.id, dua]))
  return own.duaIds.map((duaId) => byId.get(duaId)).filter((dua): dua is Dua => !!dua)
}
