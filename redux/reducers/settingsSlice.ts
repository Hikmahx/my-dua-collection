import { DEFAULT_FONT_SIZES, type FontSizeTarget } from '@/constants/settings-config'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/** Add more modes here later (e.g. 'system'). */
export type ThemePreference = 'dark' | 'light'

export interface SettingsState {
  theme: ThemePreference
  language: string // language code used for dua translations
  showTransliteration: boolean
  fontSizes: Record<FontSizeTarget, number> // px
  dailyReminder: boolean
  monthlyReminders: boolean
}

// Dark mode is the default
export const initialSettingsState: SettingsState = {
  theme: 'dark',
  language: 'en',
  showTransliteration: true,
  fontSizes: DEFAULT_FONT_SIZES,
  dailyReminder: true,
  monthlyReminders: false,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemePreference>) {
      state.theme = action.payload
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload
    },
    setShowTransliteration(state, action: PayloadAction<boolean>) {
      state.showTransliteration = action.payload
    },
    setFontSize(state, action: PayloadAction<{ target: FontSizeTarget; size: number }>) {
      state.fontSizes[action.payload.target] = action.payload.size
    },
    setDailyReminder(state, action: PayloadAction<boolean>) {
      state.dailyReminder = action.payload
    },
    setMonthlyReminders(state, action: PayloadAction<boolean>) {
      state.monthlyReminders = action.payload
    },
    /** Puts the saved settings back on launch. */
    hydrateSettings(state, action: PayloadAction<Partial<SettingsState>>) {
      Object.assign(state, action.payload)
    },
  },
})

export const {
  setTheme,
  setLanguage,
  setShowTransliteration,
  setFontSize,
  setDailyReminder,
  setMonthlyReminders,
  hydrateSettings,
} = settingsSlice.actions
export default settingsSlice.reducer
