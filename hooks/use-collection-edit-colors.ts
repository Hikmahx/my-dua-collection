import { collectionEditTheme } from '@/constants/collection-edit-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

/** The Edit collection palette for the current light / dark mode. */
export const useCollectionEditColors = () =>
  collectionEditTheme[useColorScheme() === 'dark' ? 'dark' : 'light']
