import type { Dua } from '@/redux/reducers/duasSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Bump the version whenever the Dua shape or data/data.json changes,
// so an outdated cache is ignored and the app reloads from data.json.
const DUAS_KEY = 'duas:v1'

/** Returns the cached duas, or null if nothing was cached yet (=> use data.json). */
export async function loadCachedDuas(): Promise<Dua[] | null> {
  try {
    const value = await AsyncStorage.getItem(DUAS_KEY)
    if (!value) return null
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export async function saveCachedDuas(duas: Dua[]) {
  try {
    await AsyncStorage.setItem(DUAS_KEY, JSON.stringify(duas))
  } catch {
    // not critical – the data still lives in memory for this session
  }
}
