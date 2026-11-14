import { MAX_TARGET } from '@/constants/tasbih-config'
import { initialTasbihState, type TasbihState } from '@/redux/reducers/tasbihSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const TASBIH_KEY = 'tasbih:v1'

/** Returns the saved counter state, or null if nothing valid was saved yet. */
export async function loadTasbihState(): Promise<TasbihState | null> {
  try {
    const raw = await AsyncStorage.getItem(TASBIH_KEY)
    if (!raw) return null
    const v = JSON.parse(raw)
    const validTarget = Number.isInteger(v.target) && v.target >= 1 && v.target <= MAX_TARGET
    return {
      dhikrId: typeof v.dhikrId === 'string' ? v.dhikrId : initialTasbihState.dhikrId,
      count: Number.isInteger(v.count) && v.count >= 0 ? v.count : 0,
      target: validTarget ? v.target : initialTasbihState.target,
      soundEnabled: typeof v.soundEnabled === 'boolean' ? v.soundEnabled : true,
      vibrationEnabled: typeof v.vibrationEnabled === 'boolean' ? v.vibrationEnabled : true,
    }
  } catch {
    return null
  }
}

export async function saveTasbihState(state: TasbihState) {
  try {
    await AsyncStorage.setItem(TASBIH_KEY, JSON.stringify(state))
  } catch {
    // not critical – the counter still works for this session
  }
}
