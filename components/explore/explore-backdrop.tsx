import { ExploreCardsBackground } from '@/components/ui/explore-cards-background'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import type { ReactNode } from 'react'
import { View } from 'react-native'

/** The body of the Explore sub-screens: the screen colour with the low-poly pattern behind the content. */
export function ExploreBackdrop({ children }: { children: ReactNode }) {
  const isDark = useColorScheme() === 'dark'

  return (
    <View style={{ flex: 1, backgroundColor: Colors[isDark ? 'dark' : 'light'].screenBody, overflow: 'hidden' }}>
      <View style={tw`absolute top-0 left-0 right-0 bottom-0`} pointerEvents='none'>
        <ExploreCardsBackground isDark={isDark} />
      </View>
      {children}
    </View>
  )
}
