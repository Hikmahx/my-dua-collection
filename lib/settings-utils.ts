import { isAppLanguageCode, isKnownLanguage } from '@/constants/languages'
import { isArabicFontId } from '@/constants/arabic-fonts'
import { DEFAULT_FONT_SIZES, FONT_SIZE_SETTINGS } from '@/constants/settings-config'
import { isHijriAdjustment } from '@/lib/islamic-season'
import type { SettingsState } from '@/redux/reducers/settingsSlice'

/**
 * Keeps only valid values from whatever was saved, so an old or damaged save can never put the
 * app in a broken state. Font sizes are clamped to their slider range.
 */
export function sanitizeSettings(value: unknown): Partial<SettingsState> {
  if (!value || typeof value !== 'object') return {}
  const saved = value as Record<string, unknown>
  const result: Partial<SettingsState> = {}

  if (saved.theme === 'dark' || saved.theme === 'light') result.theme = saved.theme
  if (isAppLanguageCode(saved.appLanguage)) result.appLanguage = saved.appLanguage
  // `language` is the old name of translationLanguage (before the app language existed)
  const translationLanguage = saved.translationLanguage ?? saved.language
  if (isKnownLanguage(translationLanguage)) result.translationLanguage = translationLanguage
  if (typeof saved.showTransliteration === 'boolean') result.showTransliteration = saved.showTransliteration
  if (isArabicFontId(saved.arabicFont)) result.arabicFont = saved.arabicFont
  if (typeof saved.dailyReminder === 'boolean') result.dailyReminder = saved.dailyReminder
  const time = saved.dailyReminderTime as { hour?: unknown; minute?: unknown } | undefined
  if (time && Number.isInteger(time.hour) && Number.isInteger(time.minute)) {
    const { hour, minute } = time as { hour: number; minute: number }
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) result.dailyReminderTime = { hour, minute }
  }
  if (typeof saved.monthlyReminders === 'boolean') result.monthlyReminders = saved.monthlyReminders
  if (isHijriAdjustment(saved.hijriAdjustment)) result.hijriAdjustment = saved.hijriAdjustment

  if (saved.fontSizes && typeof saved.fontSizes === 'object') {
    const sizes = { ...DEFAULT_FONT_SIZES }
    for (const { key, min, max } of FONT_SIZE_SETTINGS) {
      const size = (saved.fontSizes as Record<string, unknown>)[key]
      if (typeof size === 'number' && Number.isFinite(size)) {
        sizes[key] = Math.min(max, Math.max(min, Math.round(size)))
      }
    }
    result.fontSizes = sizes
  }

  return result
}
