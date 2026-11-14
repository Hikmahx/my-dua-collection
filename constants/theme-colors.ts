/**
 * Theme color values matching tailwind.config.js (keep the two in sync).
 * Use for SVG props, icon colors, rgba() values and other places where tw classes cannot be applied.
 */
export const themeColors = {
  // Emerald
  darkEmerald: '#066653',
  softEmerald: '#27A88D',

  // Gold
  brightGold: '#C2A462',
  softGold: '#E4D0A4',
  darkGold: '#C0A25E',

  // Backgrounds
  lightBg: '#FFFFFF',
  veryDarkBg: '#013241',
  veryLightGrayishBg: '#F9F9F9',
  veryDarkNavBg: '#00242F',
  deepBg: '#002230',
  pillBg: '#F7F8F8',
  tabNavy: '#14142B',

  // Text
  darkText: '#1A1A1A',
  lightGrayishText: '#ECEDEE',
  darkGrayishText: '#666666',
  lightGrayishTextMuted: '#A0A0A0',

  // Borders
  veryLightGrayishBorder: '#E0E0E0',
  darkGrayishBorder: '#1A5A66',
} as const

/** '#RRGGBB' + 0-1 opacity -> 'rgba(r, g, b, a)'. Lets translucent colors stay tied to the palette. */
export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

/** Banner gradient in dark mode (muted teal from the dark design). */
export const darkBanner = {
  from: '#165351',
  to: '#1D6A5F',
} as const
