import { duaListTheme } from '@/constants/dua-list-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

/** The dua list palette for the current light / dark mode. */
export const useDuaListColors = () => duaListTheme[useColorScheme() === 'dark' ? 'dark' : 'light']
