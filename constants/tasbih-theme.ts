import { Colors } from '@/constants/theme'
import { themeColors as p, withAlpha } from '@/constants/theme-colors'

/**
 * Tasbih screen colors for both modes. Shared colors come from the palette
 * (theme-colors.ts); only values sampled for this screen's design are written out here.
 */
export const tasbihTheme = {
  dark: {
    arabic: p.brightGold,
    translit: p.lightGrayishText,
    translation: p.lightGrayishTextMuted,
    ringOuter: '#13434E',
    ringInner: '#063743',
    arc: p.brightGold,
    knobFill: '#F6F5ED',
    number: p.lightBg,
    caption: '#A9BDBD',
    ringShadow: '#000000',
    ringShadowOpacity: 0.35,
    muted: p.lightGrayishTextMuted, // Reset label
    pillBg: '#063743',
    pillBorder: p.darkGrayishBorder,
    pillText: p.lightGrayishTextMuted,
    pillActiveBg: p.brightGold,
    pillActiveText: p.darkText,
    toggleOn: p.brightGold,
    toggleOff: '#435156',
    // dialogs / picker
    sheetBg: Colors.dark.screenBody,
    rowBg: '#063743',
    rowBorder: withAlpha(p.darkGrayishBorder, 0.55),
    text: p.lightGrayishText,
  },
  light: {
    arabic: p.darkEmerald,
    translit: p.darkText,
    translation: '#8A8A8A',
    ringOuter: '#368374',
    ringInner: p.darkEmerald,
    arc: p.brightGold,
    knobFill: p.lightBg,
    number: p.lightBg,
    caption: '#B9D4CE',
    ringShadow: '#000000',
    ringShadowOpacity: 0.18,
    muted: '#8A8A8A',
    pillBg: '#EEEEEE',
    pillBorder: p.veryLightGrayishBorder,
    pillText: '#8E908F',
    pillActiveBg: p.brightGold,
    pillActiveText: p.darkText,
    toggleOn: p.darkEmerald,
    toggleOff: p.lightGrayishTextMuted,
    sheetBg: p.lightBg,
    rowBg: p.pillBg,
    rowBorder: p.veryLightGrayishBorder,
    text: p.darkText,
  },
} as const

export type TasbihColors = (typeof tasbihTheme)['dark' | 'light']
