import duasData from '@/data/data.json'
import { mergeCachedDuas } from '@/lib/dua-utils'
import type { Dua } from '@/redux/reducers/duasSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Bump the version only when the Dua shape itself changes. Edits to data/data.json need no bump:
// the built-in duas are always read from data.json (see mergeCachedDuas).
const DUAS_KEY = 'duas:v1'

const BUILT_IN_DUAS = duasData as Dua[]

/** The saved duas merged with data.json, or null if nothing was saved yet (=> use data.json). */
export async function loadCachedDuas(): Promise<Dua[] | null> {
  try {
    const value = await AsyncStorage.getItem(DUAS_KEY)
    if (!value) return null
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? mergeCachedDuas(parsed, BUILT_IN_DUAS) : null
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
