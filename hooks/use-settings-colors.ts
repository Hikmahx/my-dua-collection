import { settingsTheme } from '@/constants/settings-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

/** The Settings palette for the current light / dark mode. */
export const useSettingsColors = () => settingsTheme[useColorScheme() === 'dark' ? 'dark' : 'light']
