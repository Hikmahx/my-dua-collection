import { useT } from '@/hooks/use-t'
import { ArabicFontSheet } from '@/components/settings/arabic-font-sheet'
import { FontSizeSettings } from '@/components/settings/font-size-settings'
import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'
import { ToggleSwitch } from '@/components/settings/toggle-switch'
import { getArabicFont } from '@/constants/arabic-fonts'
import { setTheme } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Dark mode, font sizes and Arabic text style. Used on the Settings screen and (with
 * variant="flat") in the dua sidebar, so everything it needs comes from the store.
 */
export function AppearanceSettings({ variant }: { variant?: SettingsVariant }) {
  const dispatch = useDispatch()
  const t = useT()
  const isDark = useSelector((state: RootState) => state.settings.theme === 'dark')
  const arabicFont = useSelector((state: RootState) => state.settings.arabicFont)
  const [fontSheetOpen, setFontSheetOpen] = useState(false)

  return (
    <>
      <SettingsGroup title={t('appearance.title')} variant={variant}>
        <SettingsRow
          icon='moon-waning-crescent'
          title={t('appearance.darkMode')}
          subtitle={isDark ? t('appearance.darkOn') : t('appearance.darkOff')}
          control={
            <ToggleSwitch
              value={isDark}
              onValueChange={(on) => dispatch(setTheme(on ? 'dark' : 'light'))}
              accessibilityLabel={t('appearance.darkMode')}
            />
          }
        />
        <FontSizeSettings />
        <SettingsRow
          icon='format-letter-case'
          title={t('arabicStyle.title')}
          subtitle={getArabicFont(arabicFont).label}
          onPress={() => setFontSheetOpen(true)}
        />
      </SettingsGroup>
      <ArabicFontSheet visible={fontSheetOpen} onClose={() => setFontSheetOpen(false)} />
    </>
  )
}
