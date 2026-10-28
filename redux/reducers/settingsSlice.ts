import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/** Add more modes here later (e.g. 'system'). */
export type ThemePreference = 'dark' | 'light'

interface SettingsState {
  theme: ThemePreference
}

// Dark mode is the default
const initialState: SettingsState = { theme: 'dark' }

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemePreference>) {
      state.theme = action.payload
    },
  },
})

export const { setTheme } = settingsSlice.actions
export default settingsSlice.reducer
