import { Colors } from '@/constants/theme'
import { themeColors as p, withAlpha } from '@/constants/theme-colors'

/**
 * Colors of the dua list screens (a collection's duas, Favorites). Shared colors come from the
 * palette; the rest are sampled from the designs.
 */
export const duaListTheme = {
  dark: {
    background: Colors.dark.headerSurface, // header and list share one color in dark mode
    row: '#083541',
    circle: '#164A53',
    number: '#D5BD7D',
    title: p.lightGrayishText,
    subtitle: '#A2B5B8',
    pillBg: withAlpha(p.brightGold, 0.16),
    pillText: '#D5BD7D',
    icon: p.lightGrayishText,
    muted: p.lightGrayishTextMuted,
    accent: '#D9BC76',
  },
  light: {
    background: Colors.light.screenBody,
    row: p.lightBg,
    circle: '#E7F1ED',
    number: p.darkEmerald,
    title: p.darkText,
    subtitle: p.darkGrayishText,
    pillBg: withAlpha(p.darkEmerald, 0.1),
    pillText: p.darkEmerald,
    icon: p.darkText,
    muted: '#8A8A8A',
    accent: p.darkEmerald,
  },
} as const
