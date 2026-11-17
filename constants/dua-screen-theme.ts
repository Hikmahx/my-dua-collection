import { Colors } from '@/constants/theme'
import { themeColors as p } from '@/constants/theme-colors'

/**
 * Dua screen colors for both modes. Dark is sampled from the design; light follows the other
 * screens' light mode (no design yet).
 */
export const duaScreenTheme = {
  dark: {
    header: Colors.dark.headerSurface,
    body: '#083541',
    track: '#00202D', // progress bar track
    accent: p.brightGold, // progress bar and the "4/11" pill
    pillText: Colors.dark.headerSurface,
    title: p.lightBg,
    text: p.lightBg,
    muted: '#A2B5B8', // the source line
    button: '#337567', // "View Dua Virtue"
    buttonText: p.lightBg,
    bar: Colors.dark.headerSurface, // bottom bar
    icon: p.lightBg,
    favorite: '#E5484D',
    // counter
    ringOuter: '#174752',
    ringInner: '#063743',
    arc: p.brightGold,
    knobFill: '#F6F5ED',
    number: '#F6F5ED',
    caption: '#A9BDBD',
    ringShadow: '#000000',
    ringShadowOpacity: 0.35,
  },
  light: {
    header: Colors.light.headerSurface,
    body: Colors.light.screenBody,
    track: '#E4EAE7',
    accent: p.darkEmerald,
    pillText: p.lightBg,
    title: p.darkText,
    text: p.darkText,
    muted: '#6F7A74',
    button: p.darkEmerald,
    buttonText: p.lightBg,
    bar: Colors.light.headerSurface,
    icon: p.darkText,
    favorite: '#E5484D',
    ringOuter: '#368374',
    ringInner: p.darkEmerald,
    arc: p.brightGold,
    knobFill: p.lightBg,
    number: p.lightBg,
    caption: '#DDEBE6',
    ringShadow: '#000000',
    ringShadowOpacity: 0.2,
  },
} as const
