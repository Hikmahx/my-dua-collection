import { themeColors as p, withAlpha } from '@/constants/theme-colors'

/**
 * Explore screen colors for both modes. Shared colors come from the palette
 * (theme-colors.ts); only values specific to this screen are written out here.
 */
export const exploreTheme = {
  dark: {
    label: p.lightGrayishText,
    icon: p.brightGold,
    iconBox: withAlpha(p.darkGrayishBorder, 0.55), // rounded square behind each icon
    // 3x3 cells alternate: #043340 @ 50%  /  #063743 @ 70%
    cellA: 'rgba(4, 51, 64, 0.5)',
    cellB: 'rgba(6, 55, 67, 0.7)',
    gridLine: withAlpha(p.darkGrayishBorder, 0.55),
    searchBand: 'transparent', // strip behind the search bar
  },
  light: {
    label: p.darkText,
    icon: p.brightGold, // gold icon on a solid emerald box
    iconBox: p.darkEmerald,
    cellA: withAlpha(p.lightBg, 0.5), // frosts the pattern behind
    cellB: withAlpha(p.lightBg, 0.5),
    gridLine: p.veryLightGrayishBorder,
    searchBand: '#EDEDED',
  },
} as const
