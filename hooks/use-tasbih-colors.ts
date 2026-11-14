import { tasbihTheme } from '@/constants/tasbih-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

/** The Tasbih palette for the current light / dark mode. */
export const useTasbihColors = () => tasbihTheme[useColorScheme() === 'dark' ? 'dark' : 'light']
