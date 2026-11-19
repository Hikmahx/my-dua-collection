import { COLLECTION_DEFS, type UserCollection } from '@/constants/collections'
import AsyncStorage from '@react-native-async-storage/async-storage'

const COLLECTIONS_KEY = 'collections:v1'

/**
 * Turns what was saved into valid collections, dropping what is not usable: no id or name, an id
 * that a pre-made collection or an earlier saved one already has, ids of duas that are not text.
 * Returns null when it is not a list at all.
 */
export function sanitizeCollections(value: unknown): UserCollection[] | null {
  if (!Array.isArray(value)) return null
  const taken = new Set(COLLECTION_DEFS.map((collection) => collection.id))
  const result: UserCollection[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const { id, name, iconKey, duaIds, sharedBy } = item as Record<string, unknown>
    if (typeof id !== 'string' || !id || taken.has(id)) continue
    if (typeof name !== 'string' || !name.trim()) continue
    taken.add(id)
    result.push({
      id,
      name: name.trim(),
      iconKey: (typeof iconKey === 'string' && iconKey ? iconKey : 'journal') as UserCollection['iconKey'],
      isUserCreated: true,
      duaIds: Array.isArray(duaIds)
        ? [...new Set(duaIds.filter((duaId): duaId is string => typeof duaId === 'string'))]
        : [],
      ...(typeof sharedBy === 'string' && sharedBy ? { sharedBy } : {}),
    })
  }
  return result
}

/** The collections the user made, or null if none were saved yet. */
export async function loadCollections(): Promise<UserCollection[] | null> {
  try {
    const raw = await AsyncStorage.getItem(COLLECTIONS_KEY)
    return raw ? sanitizeCollections(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export async function saveCollections(collections: UserCollection[]) {
  try {
    await AsyncStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
  } catch {
    // not critical – the collections still live in memory for this session
  }
}
