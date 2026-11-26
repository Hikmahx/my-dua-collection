import { Colors } from '@/constants/theme'
import { themeColors as p, withAlpha } from '@/constants/theme-colors'
import type { CardThemeId } from '@/constants/share-config'

/**
 * The look of the share card. The card is a picture people send around, so it keeps its own colors
 * whatever the app's light / dark mode is. The choices are the app's two brand colors:
 * emerald (the primary gradient) and gold, on a dark or a light ground.
 */
export interface CardTheme {
  id: CardThemeId
  /** Background gradient, top-left to bottom-right. */
  from: string
  to: string
  arabic: string
  title: string
  transliteration: string
  translation: string
  /** Frame, divider, ornament and the star pattern. */
  accent: string
  patternOpacity: number
  /** Reference pill and watermark. */
  pillBg: string
  pillText: string
  watermark: string
}

export const CARD_THEMES: Record<CardThemeId, CardTheme> = {
  emerald: {
    id: 'emerald',
    from: p.darkEmerald,
    to: p.softEmerald,
    arabic: '#FFFFFF',
    title: p.softGold,
    transliteration: '#D3EFE8',
    translation: '#F1FAF7',
    accent: p.softGold,
    patternOpacity: 0.2,
    pillBg: withAlpha('#000000', 0.18),
    pillText: p.softGold,
    watermark: p.softGold,
  },
  night: {
    id: 'night',
    from: '#00212E',
    to: '#0A4A55',
    arabic: p.softGold,
    title: p.brightGold,
    transliteration: p.lightGrayishText,
    translation: '#B9CBCE',
    accent: p.brightGold,
    patternOpacity: 0.16,
    pillBg: withAlpha(p.brightGold, 0.14),
    pillText: p.softGold,
    watermark: p.brightGold,
  },
  cream: {
    id: 'cream',
    from: '#FBF8EE',
    to: '#EFE6CF',
    arabic: p.darkEmerald,
    title: '#9A7F3F',
    transliteration: '#40524C',
    translation: '#2B2B2B',
    accent: p.darkGold,
    patternOpacity: 0.28,
    pillBg: withAlpha(p.darkEmerald, 0.1),
    pillText: p.darkEmerald,
    watermark: p.darkGold,
  },
}

/** Colors of the share sheet itself (not the card), for both modes. Shared colors come from the palette. */
export const shareTheme = {
  dark: {
    sheetBg: Colors.dark.screenBody,
    handle: withAlpha(p.darkGrayishBorder, 0.55),
    text: p.lightGrayishText,
    muted: p.lightGrayishTextMuted,
    accent: p.brightGold,
    rowBg: '#063743',
    rowBorder: withAlpha(p.darkGrayishBorder, 0.55),
    chipBg: '#063743',
    chipActiveBg: p.brightGold,
    chipText: p.lightGrayishTextMuted,
    chipActiveText: p.darkText,
    tileBg: '#063743',
    danger: '#E5484D',
    success: '#4CC9A7',
    checkOn: p.brightGold,
    checkOnText: p.darkText,
  },
  light: {
    sheetBg: p.lightBg,
    handle: p.veryLightGrayishBorder,
    text: p.darkText,
    muted: '#6F7A74',
    accent: p.darkEmerald,
    rowBg: p.pillBg,
    rowBorder: p.veryLightGrayishBorder,
    chipBg: '#EEEEEE',
    chipActiveBg: p.darkEmerald,
    chipText: '#6F7A74',
    chipActiveText: p.lightBg,
    tileBg: p.pillBg,
    danger: '#E5484D',
    success: p.darkEmerald,
    checkOn: p.darkEmerald,
    checkOnText: p.lightBg,
  },
} as const
