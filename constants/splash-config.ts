import { themeColors } from '@/constants/theme-colors'

/**
 * Splash screen layout. Everything is measured on the 375 x 690 design
 * (assets/images/splash-background.svg + the logo), and scaled to the real screen by AppSplash.
 */
export const SPLASH = {
  /** Edge colour of the artwork. Also the native splash colour in app.json. */
  background: '#00212E',

  // The design the numbers below were measured on
  designWidth: 375,
  designHeight: 690,

  /** Prayer-beads logo: top-left of its 113 x 113 box, in design px. */
  logo: { x: 141.5, y: 226.5, size: 113, color: themeColors.brightGold },

  /** "My Dua Collection": horizontal centre and top of its line box, in design px. */
  title: {
    text: 'My Dua Collection',
    centerX: 185.5,
    top: 372,
    fontSize: 24,
    lineHeight: 31,
    color: themeColors.lightBg,
  },

  /** Artwork + logo + name fade in, stay at least this long, then the whole splash fades out. */
  fadeInMs: 500,
  minDurationMs: 3000,
  fadeOutMs: 400,
} as const
