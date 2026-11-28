import {
  DEFAULT_APP_LANGUAGE,
  DEFAULT_TRANSLATION_LANGUAGE,
  type AppLanguageCode,
} from '@/constants/languages'
import { DEFAULT_ARABIC_FONT, type ArabicFontId } from '@/constants/arabic-fonts'
import { DEFAULT_FONT_SIZES, type FontSizeTarget } from '@/constants/settings-config'
import { DEFAULT_DAILY_REMINDER_TIME } from '@/constants/reminder-config'
import type { HijriAdjustment } from '@/lib/islamic-season'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/** Add more modes here later (e.g. 'system'). */
export type ThemePreference = 'dark' | 'light'

export interface SettingsState {
  theme: ThemePreference
  appLanguage: AppLanguageCode // language of the app's own text (buttons, titles, messages)
  translationLanguage: string // language code of the dua translation that is shown
  showTransliteration: boolean
  fontSizes: Record<FontSizeTarget, number> // px
  arabicFont: ArabicFontId
  dailyReminder: boolean
  /** When the daily reminder goes out (the phone's local time). */
  dailyReminderTime: { hour: number; minute: number }
  monthlyReminders: boolean
  /** Days added to the Hijri date to match the user's own moon sighting: -1, 0 or +1 (see lib/islamic-season.ts). */
  hijriAdjustment: HijriAdjustment
}

// Dark mode is the default
export const initialSettingsState: SettingsState = {
  theme: 'dark',
  appLanguage: DEFAULT_APP_LANGUAGE,
  translationLanguage: DEFAULT_TRANSLATION_LANGUAGE,
  showTransliteration: true,
  fontSizes: DEFAULT_FONT_SIZES,
  arabicFont: DEFAULT_ARABIC_FONT,
  dailyReminder: true,
  dailyReminderTime: { ...DEFAULT_DAILY_REMINDER_TIME },
  monthlyReminders: false,
  hijriAdjustment: 0,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemePreference>) {
      state.theme = action.payload
    },
    setAppLanguage(state, action: PayloadAction<AppLanguageCode>) {
      state.appLanguage = action.payload
    },
    setTranslationLanguage(state, action: PayloadAction<string>) {
      state.translationLanguage = action.payload
    },
    setShowTransliteration(state, action: PayloadAction<boolean>) {
      state.showTransliteration = action.payload
    },
    setFontSize(state, action: PayloadAction<{ target: FontSizeTarget; size: number }>) {
      state.fontSizes[action.payload.target] = action.payload.size
    },
    setArabicFont(state, action: PayloadAction<ArabicFontId>) {
      state.arabicFont = action.payload
    },
    setDailyReminder(state, action: PayloadAction<boolean>) {
      state.dailyReminder = action.payload
    },
    setDailyReminderTime(state, action: PayloadAction<{ hour: number; minute: number }>) {
      state.dailyReminderTime = action.payload
    },
    setMonthlyReminders(state, action: PayloadAction<boolean>) {
      state.monthlyReminders = action.payload
    },
    setHijriAdjustment(state, action: PayloadAction<HijriAdjustment>) {
      state.hijriAdjustment = action.payload
    },
    /** Puts the saved settings back on launch. */
    hydrateSettings(state, action: PayloadAction<Partial<SettingsState>>) {
      Object.assign(state, action.payload)
    },
  },
})

export const {
  setTheme,
  setAppLanguage,
  setTranslationLanguage,
  setShowTransliteration,
  setFontSize,
  setArabicFont,
  setDailyReminder,
  setDailyReminderTime,
  setMonthlyReminders,
  setHijriAdjustment,
  hydrateSettings,
} = settingsSlice.actions
export default settingsSlice.reducer
