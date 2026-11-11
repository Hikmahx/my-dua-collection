import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/** Add more modes here later (e.g. 'system'). */
export type ThemePreference = 'dark' | 'light'

interface SettingsState {
  theme: ThemePreference
  language: string // language code used for dua translations
  showTransliteration: boolean
}

// Dark mode is the default
const initialState: SettingsState = {
  theme: 'dark',
  language: 'en',
  showTransliteration: true,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
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
  },
})

export const { setTheme, setLanguage, setShowTransliteration } =
  settingsSlice.actions
export default settingsSlice.reducer
