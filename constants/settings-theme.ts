import { Colors } from '@/constants/theme'
import { themeColors as p } from '@/constants/theme-colors'

/**
 * Settings screen colors for both modes. Shared colors come from the palette (theme-colors.ts);
 * only values sampled from this screen's design are written out here.
 */
export const settingsTheme = {
  dark: {
    body: Colors.dark.headerSurface, // header, profile and list share one color in dark mode
    header: Colors.dark.headerSurface,
    card: '#07343E',
    divider: '#0A2E37',
    accent: p.brightGold, // section titles, row icons, values
    title: p.lightGrayishText,
    muted: '#A8BFC2', // subtitles, chevrons, footer
    avatarBg: '#10434B',
    toggleOn: p.brightGold,
    toggleOff: '#435156',
    toggleThumbOn: Colors.dark.headerSurface,
    toggleThumbOff: p.lightBg,
    sliderTrack: '#1D4850',
    sliderFill: p.brightGold,
    previewBg: '#10434B',
    previewArabic: p.brightGold,
  },
  light: {
    body: Colors.light.screenBody,
    header: Colors.light.headerSurface,
    card: p.lightBg,
    divider: '#EDF0EE',
    accent: p.darkEmerald,
    title: p.darkText,
    muted: '#6F7A74',
    avatarBg: '#E9F2EE',
    toggleOn: p.darkEmerald,
    toggleOff: p.lightGrayishTextMuted,
    toggleThumbOn: p.lightBg,
    toggleThumbOff: p.lightBg,
    sliderTrack: '#EDF0EE',
    sliderFill: p.darkEmerald,
    previewBg: '#E9F2EE',
    previewArabic: p.darkEmerald,
  },
} as const

export type SettingsColors = (typeof settingsTheme)['dark' | 'light']
