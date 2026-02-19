import { useColorScheme } from '@/hooks/use-color-scheme'
import { Image, Pressable, Text, View } from 'react-native'

interface DuaCardProps {
  title: string
  count: number
  icon?: string // Path to icon SVG
  onPress?: () => void
  backgroundColor?: string
  verseReference?: string // For Quranic duas
}

export function DuaCard({
  title,
  count,
  icon,
  onPress,
  backgroundColor,
  verseReference,
}: DuaCardProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const bgColor =
    backgroundColor ||
    (isDark ? 'bg-very-dark-nav-bg' : 'bg-very-light-grayish-bg')
  const textColor = isDark ? 'text-light-grayish-text' : 'text-dark-text'
  const secondaryText = isDark
    ? 'text-light-grayish-text-muted'
    : 'text-dark-grayish-text'

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      className={`rounded-2xl p-5 ${bgColor} flex-1`}
    >
      <View className='flex-row items-start justify-between'>
        <View className='flex-1'>
          <Text className={`font-semibold text-lg ${textColor}`}>{title}</Text>
          <Text className={`text-sm mt-1 ${secondaryText}`}>{count} Duas</Text>
          {verseReference && (
            <Text className={`text-xs mt-2 ${secondaryText}`}>
              {verseReference}
            </Text>
          )}
        </View>
        {icon && (
          <View className='ml-3'>
            <Image
              source={{ uri: icon }}
              style={{ width: 28, height: 28 }}
              resizeMode='contain'
            />
          </View>
        )}
      </View>
    </Pressable>
  )
}
