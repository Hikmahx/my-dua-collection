import { sanitizeSettings } from '@/lib/settings-utils'
import type { SettingsState } from '@/redux/reducers/settingsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SETTINGS_KEY = 'settings:v1'
const LEGACY_THEME_KEY = 'settings:theme' // from before all settings were saved together

/** The saved settings, or null if nothing was saved yet (=> the defaults). */
export async function loadSettings(): Promise<Partial<SettingsState> | null> {
  try {
    const saved = await AsyncStorage.getItem(SETTINGS_KEY)
    if (saved) return sanitizeSettings(JSON.parse(saved))

    const legacyTheme = await AsyncStorage.getItem(LEGACY_THEME_KEY)
    return legacyTheme === 'dark' || legacyTheme === 'light' ? { theme: legacyTheme } : null
  } catch {
    return null
  }
}

export async function saveSettings(settings: SettingsState) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // not critical: the choices still apply for this session
  }
}
