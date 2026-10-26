import { CollectionIcon, type CollectionIconKey } from '@/components/icons/CollectionIcons'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

export interface CollectionCardProps {
  title: string
  count: number
  iconKey: CollectionIconKey
  onPress?: () => void
}

/** Reusable card for a dua collection (title, count, icon, soft wave pattern). */
export function CollectionCard({
  title,
  count,
  iconKey,
  onPress,
}: CollectionCardProps) {
  const isDark = useColorScheme() === 'dark'
  const waveFill = isDark ? '#FFFFFF' : '#C2A462'

  return (
    // Outer view: background + shadow. Inner Pressable clips the wave pattern.
    <View
      style={[
        tw`w-full rounded-2xl ${isDark ? 'bg-very-dark-bg' : 'bg-white'}`,
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0 : 0.06,
          shadowRadius: 8,
          elevation: isDark ? 0 : 2,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          tw`rounded-2xl overflow-hidden min-h-[70px] pt-[14px] pb-2 px-[10px]`,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        {/* decorative waves (top + bottom-left) */}
        <Svg
          style={StyleSheet.absoluteFill}
          viewBox='0 0 152 70'
          preserveAspectRatio='none'
        >
          <Path
            d='M0 0H152V12C125 4 100 18 70 10C40 3 18 14 0 10Z'
            fill={waveFill}
            fillOpacity={isDark ? 0.04 : 0.06}
          />
          <Path
            d='M0 70V57C18 63 38 56 62 70Z'
            fill={waveFill}
            fillOpacity={isDark ? 0.04 : 0.06}
          />
        </Svg>

        <Text
          numberOfLines={1}
          style={[
            tw`font-berkshire text-[12px] ${isDark ? 'text-white' : 'text-dark-text'}`,
            { lineHeight: 20 },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            tw`font-nunito text-[9px] mt-1 ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`,
            { lineHeight: 14 },
          ]}
        >
          {count} {count === 1 ? 'Dua' : 'Duas'}
        </Text>

        {/* icon box sits ~46pt from the top and 9pt from the right, like the design */}
        <View
          style={tw`absolute right-[9px] top-[32px] w-[30px] h-[28px] items-center justify-center`}
        >
          <CollectionIcon name={iconKey} size={29} />
        </View>
      </Pressable>
    </View>
  )
}
