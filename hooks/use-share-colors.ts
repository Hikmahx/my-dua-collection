import { shareTheme } from '@/constants/share-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

/** The share sheet palette for the current light / dark mode. */
export const useShareColors = () => shareTheme[useColorScheme() === 'dark' ? 'dark' : 'light']
