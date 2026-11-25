import type { UserCollection } from '@/constants/collections'
import type { Share } from '@/data/types'
import type { Dua, DuaContent } from '@/redux/reducers/duasSlice'

/**
 * What happens when the recipient answers a share (the rules of data/DATA.md, "Sharing"). Nothing
 * here is on a screen yet: the screen that lists pending shares calls these, and the backend can
 * follow the same rules.
 */

const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ').toLowerCase()

/** A shared collection is a duplicate when the recipient has one with the same name (case and extra spaces ignored). */
export const hasDuplicateCollection = (name: string, collections: readonly { name: string }[]) =>
  collections.some((collection) => normalizeName(collection.name) === normalizeName(name))

/**
 * A shared dua is a duplicate when the collection the recipient chose already holds a dua with the
 * same source and the same reference. A dua with no source or reference cannot be matched
 * (see "Still to decide" in DATA.md).
 */
export function findDuplicateDua(shared: Pick<Dua, 'source' | 'reference'>, inChosenCollection: readonly Dua[]): Dua | undefined {
  if (!shared.source || !shared.reference) return undefined
  return inChosenCollection.find((dua) => dua.source === shared.source && dua.reference === shared.reference)
}

/** The recipient's own copy of a shared dua: a new id, `origin: 'shared'` and `sharedBy` the direct sender. */
export function buildSharedDuaCopy(dua: Dua, senderId: string, newId: string, collectionIds: string[] = []): DuaContent {
  const { isFavorite: _isFavorite, ...content } = dua
  return { ...content, id: newId, origin: 'shared', sharedBy: senderId, collection: collectionIds }
}

/** The recipient's own copy of a shared collection. Its duas (`duaIds`) must already be copies the recipient has. */
export function buildSharedCollectionCopy(
  collection: { name: string; iconKey: UserCollection['iconKey'] },
  senderId: string,
  newId: string,
  duaIds: string[],
): UserCollection {
  return { id: newId, name: collection.name, iconKey: collection.iconKey, isUserCreated: true, sharedBy: senderId, duaIds }
}

/** The share after the recipient answered. A share that is not pending is returned as it is. */
export function respondToShare(share: Share, status: 'accepted' | 'declined', now: string): Share {
  return share.status === 'pending' ? { ...share, status, respondedAt: now } : share
}
