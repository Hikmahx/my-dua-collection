import type { ThemePreference } from '@/redux/reducers/settingsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const THEME_KEY = 'settings:theme'

/** Returns the saved theme, or null if nothing was saved yet (=> default dark). */
export async function loadThemePreference(): Promise<ThemePreference | null> {
  try {
    const value = await AsyncStorage.getItem(THEME_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

export async function saveThemePreference(theme: ThemePreference) {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme)
  } catch {
    // not critical – the choice still applies for this session
  }
}
