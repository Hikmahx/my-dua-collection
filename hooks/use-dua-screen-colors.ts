import { duaScreenTheme } from '@/constants/dua-screen-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

/** The Dua screen palette for the current light / dark mode. */
export const useDuaScreenColors = () => duaScreenTheme[useColorScheme() === 'dark' ? 'dark' : 'light']
