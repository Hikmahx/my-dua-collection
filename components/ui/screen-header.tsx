import { AppearanceMenuButton } from '@/components/ui/appearance-menu-button'
import { Colors } from '@/constants/theme'
import { themeColors } from '@/constants/theme-colors'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface ScreenHeaderProps {
  title: string
  /** Space under the title row (the designs differ a little per screen). */
  bottomPadding?: number
  /** Right-hand slot. Defaults to the Appearance menu button. */
  right?: ReactNode
}

/**
 * The header band shared by the tab screens: title on the left, Appearance menu on the right,
 * on its own surface colour (the screen body below has a different one). Handles the top safe area.
 */
export function ScreenHeader({
  title,
  bottomPadding = 16,
  right = <AppearanceMenuButton />,
}: ScreenHeaderProps) {
  const isDark = useColorScheme() === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']
  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        backgroundColor: colors.headerSurface,
        paddingTop: insets.top,
        paddingBottom: bottomPadding,
        paddingHorizontal: 30,
      }}
    >
      <View style={tw`flex-row items-center justify-between min-h-[30px]`}>
        <Text
          style={[
            tw`font-nunito-extrabold text-[21px]`,
            { color: isDark ? themeColors.lightGrayishText : themeColors.darkText },
          ]}
        >
          {title}
        </Text>
        {right}
      </View>
    </View>
  )
}
