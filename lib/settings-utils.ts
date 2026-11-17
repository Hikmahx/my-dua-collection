import { DEFAULT_AVATAR } from '@/constants/avatar-config'
import { DEFAULT_FONT_SIZES, FONT_SIZE_SETTINGS } from '@/constants/settings-config'
import { isHexColor } from '@/lib/color'
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
  if (typeof saved.language === 'string' && saved.language) result.language = saved.language
  if (typeof saved.showTransliteration === 'boolean') result.showTransliteration = saved.showTransliteration
  if (typeof saved.dailyReminder === 'boolean') result.dailyReminder = saved.dailyReminder
  if (typeof saved.monthlyReminders === 'boolean') result.monthlyReminders = saved.monthlyReminders

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

  if (saved.avatar && typeof saved.avatar === 'object') {
    const avatar = saved.avatar as Record<string, unknown>
    result.avatar = {
      gender: avatar.gender === 'female' ? 'female' : 'male',
      skin: isHexColor(avatar.skin) ? avatar.skin : DEFAULT_AVATAR.skin,
      hair: isHexColor(avatar.hair) ? avatar.hair : DEFAULT_AVATAR.hair,
      shirt: isHexColor(avatar.shirt) ? avatar.shirt : DEFAULT_AVATAR.shirt,
      cap: isHexColor(avatar.cap) ? avatar.cap : DEFAULT_AVATAR.cap,
      hijab: isHexColor(avatar.hijab) ? avatar.hijab : DEFAULT_AVATAR.hijab,
    }
  }

  return result
}
