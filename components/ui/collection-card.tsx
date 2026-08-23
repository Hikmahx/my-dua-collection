import { CollectionIcon, type CollectionIconKey } from '@/components/icons/CollectionIcons'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { Pressable, Text, View } from 'react-native'

export interface CollectionCardProps {
  title: string
  count: number
  iconKey: CollectionIconKey
  onPress?: () => void
}

/** Reusable card for a dua collection (title, count, icon). */
export function CollectionCard({
  title,
  count,
  iconKey,
  onPress,
}: CollectionCardProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        tw`rounded-2xl p-5 flex-1 min-w-0 ${isDark ? 'bg-very-dark-nav-bg' : 'bg-white'}`,
        { opacity: pressed ? 0.7 : 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
      ]}
    >
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-1 mr-3`}>
          <Text
            style={tw`font-semibold text-base ${isDark ? 'text-light-grayish-text' : 'text-dark-text'}`}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text style={tw`text-sm mt-1 ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}>
            {count} Duas
          </Text>
        </View>
        <View style={tw`flex-shrink-0`}>
          <CollectionIcon name={iconKey} size={28} />
        </View>
      </View>
    </Pressable>
  )
}
