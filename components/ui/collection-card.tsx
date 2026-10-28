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
        tw`w-full rounded-2xl ${isDark ? 'bg-very-dark-bg' : 'bg-white border-light-grayish-bg'}`,
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0 : 0.07,
          shadowRadius: 8,
          elevation: isDark ? 0 : 2,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          tw`rounded-2xl overflow-hidden min-h-[90px] pt-[14px] pb-2 px-[10px]`,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            tw`font-berkshire text-[18px] ${isDark ? 'text-white' : 'text-dark-text'}`,
            { lineHeight: 20 },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            tw`font-nunito text-[12px] mt-3 ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`,
            { lineHeight: 14 },
          ]}
        >
          {count} {count === 1 ? 'Dua' : 'Duas'}
        </Text>

        {/* icon box sits ~46pt from the top and 9pt from the right, like the design */}
        <View
          style={tw`absolute right-[9px] bottom-[12px] w-[30px] h-[28px] items-center justify-center`}
        >
          <CollectionIcon name={iconKey} size={29} />
        </View>
      </Pressable>
    </View>
  )
}
