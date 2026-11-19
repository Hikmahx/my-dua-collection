import { isStoredDuas, mergeStoredDuas, toStoredDuas, type StoredDuas } from '@/lib/dua-utils'
import { normalizeFavoriteOrder } from '@/lib/favorites'
import { BUILT_IN_DUAS, type Dua } from '@/redux/reducers/duasSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Bump the version only when the saved shape itself changes. Edits to data/dua.json need no bump:
// the built-in duas are always read from dua.json (see mergeStoredDuas).
const DUAS_KEY = 'duas:v2' // { favoriteIds (in the user's order), userDuas }
// v1 saved the whole duas array (built-in duas included). It is converted once, then removed.
const LEGACY_DUAS_KEY = 'duas:v1'

/** The duas, and the favorites in the order the user arranged them. */
export interface CachedDuas {
  duas: Dua[]
  favoriteOrder: string[]
}

const toCached = (stored: StoredDuas): CachedDuas => {
  const duas = mergeStoredDuas(stored, BUILT_IN_DUAS)
  return { duas, favoriteOrder: normalizeFavoriteOrder(duas, stored.favoriteIds) }
}

/** The saved favorites and added duas merged with dua.json, or null if nothing was saved yet (=> use dua.json). */
export async function loadCachedDuas(): Promise<CachedDuas | null> {
  try {
    const value = await AsyncStorage.getItem(DUAS_KEY)
    if (value) {
      const parsed: unknown = JSON.parse(value)
      return isStoredDuas(parsed) ? toCached(parsed) : null
    }
    return await migrateLegacyDuas()
  } catch {
    return null
  }
}

/** Saves only what the user changed: the favorites (in their order), and the duas they added. */
export async function saveCachedDuas(duas: Dua[], favoriteOrder: string[]) {
  try {
    await AsyncStorage.setItem(DUAS_KEY, JSON.stringify(toStoredDuas(duas, BUILT_IN_DUAS, favoriteOrder)))
  } catch {
    // not critical – the data still lives in memory for this session
  }
}

/** One-time upgrade from `duas:v1`. The old copy is removed only after the new one is saved. */
async function migrateLegacyDuas(): Promise<CachedDuas | null> {
  const legacy = await AsyncStorage.getItem(LEGACY_DUAS_KEY)
  if (!legacy) return null

  const parsed: unknown = JSON.parse(legacy)
  if (!Array.isArray(parsed)) return null

  const stored: StoredDuas = toStoredDuas(
    parsed.filter((dua): dua is Dua => !!dua && typeof dua === 'object' && typeof dua.id === 'string'),
    BUILT_IN_DUAS,
  )
  try {
    await AsyncStorage.setItem(DUAS_KEY, JSON.stringify(stored))
    await AsyncStorage.removeItem(LEGACY_DUAS_KEY)
  } catch {
    // the old copy stays, and the upgrade runs again next launch
  }
  return toCached(stored)
}
