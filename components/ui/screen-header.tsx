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
  /** Small line under the title, e.g. "11 duas". */
  subtitle?: string
  /** Space under the header content (the designs differ a little per screen). */
  bottomPadding?: number
  /** Left-hand slot, e.g. a back button. Empty by default. */
  left?: ReactNode
  /** Right-hand slot. Defaults to the Appearance menu button. */
  right?: ReactNode
}

/**
 * The header band shared by the screens: title (and optional subtitle) with a slot on each side,
 * on its own surface colour (the screen body below may have a different one). Handles the top
 * safe area.
 */
export function ScreenHeader({
  title,
  subtitle,
  bottomPadding = 16,
  left,
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
      <View style={tw`flex-row items-start`}>
        {left && <View style={tw`h-[30px] justify-center mr-[13px]`}>{left}</View>}

        <View style={tw`flex-1`}>
          <View style={tw`h-[30px] justify-center`}>
            <Text
              numberOfLines={1}
              style={[
                tw`font-nunito-extrabold text-[21px]`,
                { color: isDark ? themeColors.lightGrayishText : themeColors.darkText },
              ]}
            >
              {title}
            </Text>
          </View>
          {subtitle && (
            <Text
              style={[
                tw`font-nunito text-[11px] leading-[14px] mt-[6px]`,
                { color: isDark ? themeColors.lightGrayishTextMuted : '#8A8A8A' },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <View style={tw`h-[30px] justify-center`}>{right}</View>
      </View>
    </View>
  )
}
