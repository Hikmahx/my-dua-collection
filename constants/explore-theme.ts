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
    // topic list + article screens
    backIcon: p.lightGrayishText,
    rowTitle: p.lightGrayishText,
    rowPreview: '#A2B5B8',
    chevron: '#7F9CA3',
    arabic: '#D5BD7D', // the Arabic name on the right of a Names of Allah row
    card: 'rgba(4, 51, 64, 0.7)', // behind an article's text
    bodyText: p.lightGrayishText,
  },
  light: {
    label: p.darkText,
    icon: p.brightGold, // gold icon on a solid emerald box
    iconBox: p.darkEmerald,
    cellA: withAlpha(p.lightBg, 0.5), // frosts the pattern behind
    cellB: withAlpha(p.lightBg, 0.5),
    gridLine: p.veryLightGrayishBorder,
    searchBand: '#EDEDED',
    backIcon: p.darkText,
    rowTitle: p.darkText,
    rowPreview: '#8A8A8A',
    chevron: '#8A8A8A',
    arabic: p.darkEmerald,
    card: withAlpha(p.lightBg, 0.9),
    bodyText: p.darkText,
  },
} as const
