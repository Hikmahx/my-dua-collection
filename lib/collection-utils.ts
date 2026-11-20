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
 * - A pre-made collection holds the duas that name it in their `collection`.
 */
export function getDuasInCollection(id: string, duas: Dua[], userCollections: UserCollection[]): Dua[] {
  const own = userCollections.find((collection) => collection.id === id)
  if (!own) return duas.filter((dua) => dua.collection.includes(id))
  const byId = new Map(duas.map((dua) => [dua.id, dua]))
  return own.duaIds.map((duaId) => byId.get(duaId)).filter((dua): dua is Dua => !!dua)
}

/** A new id for a collection the user makes. It cannot clash with the readable ids of pre-made ones. */
export const createCollectionId = () =>
  `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

/**
 * True when a pre-made collection, one of the user's collections, or one of `pendingNames` already
 * has this name, ignoring case.
 */
export function isCollectionNameTaken(
  name: string,
  userCollections: UserCollection[],
  pendingNames: string[] = [],
): boolean {
  const wanted = name.trim().toLowerCase()
  return [...COLLECTION_DEFS.map((collection) => collection.name), ...userCollections.map((collection) => collection.name), ...pendingNames].some(
    (existing) => existing.trim().toLowerCase() === wanted,
  )
}

/**
 * Every collection a dua is in: the pre-made ones that name it in its `collection`, and the user's
 * collections that list it. Ids that no collection has any more are left out.
 */
export function getCollectionIdsOfDua(dua: Dua, userCollections: UserCollection[]): string[] {
  const premade = dua.collection.filter((id) => COLLECTION_DEFS.some((collection) => collection.id === id))
  const own = userCollections.filter((collection) => collection.duaIds.includes(dua.id)).map((collection) => collection.id)
  return [...new Set([...premade, ...own])]
}
