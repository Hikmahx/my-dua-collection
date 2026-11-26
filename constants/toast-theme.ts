import { themeColors as p, withAlpha } from '@/constants/theme-colors'

export type ToastKind = 'success' | 'error' | 'info'

/** How long a toast stays (ms). A longer message gets more time. */
export const TOAST_SHORT_MS = 2600
export const TOAST_LONG_MS = 4200

/**
 * The look of the in-app toast (iOS) in dark and light mode. Android shows its own native toast, which cannot be styled.
 */
export const toastTheme = {
  dark: {
    background: '#02303C',
    border: withAlpha(p.brightGold, 0.35),
    text: p.lightGrayishText,
    shadow: '#000000',
    shadowOpacity: 0.3,
    icon: { success: '#6FD8B8', error: '#FF8A8E', info: p.softGold },
  },
  light: {
    background: p.lightBg,
    border: p.veryLightGrayishBorder,
    text: p.darkText,
    shadow: '#000000',
    shadowOpacity: 0.14,
    icon: { success: p.darkEmerald, error: '#E5484D', info: p.darkGold },
  },
} as const
