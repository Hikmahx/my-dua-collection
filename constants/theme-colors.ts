/**
 * Theme color values matching tailwind.config.js.
 * Use for SVG and other places where tw classes cannot be applied.
 */
export const themeColors = {
  darkEmerald: '#066653',
  softEmerald: '#27A88D',
  brightGold: '#C2A462',
  softGold: '#E4D0A4',
  darkGold: '#C0A25E',
  darkText: '#1A1A1A',
  darkGrayishText: '#666666',
  lightGrayishTextMuted: '#A0A0A0',
} as const

/** Banner gradient in dark mode (muted teal from the dark design). */
export const darkBanner = {
  from: '#165351',
  to: '#1D6A5F',
} as const
