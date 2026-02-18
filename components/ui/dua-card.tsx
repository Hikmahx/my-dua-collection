import { useColorScheme } from '@/hooks/use-color-scheme'
import { Pressable, Text, View } from 'react-native'

interface DuaCardProps {
  title: string
  count: number
  icon?: React.ReactNode
  onPress?: () => void
  backgroundColor?: string
}

export function DuaCard({
  title,
  count,
  icon,
  onPress,
  backgroundColor,
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
        </View>
        {icon && <View className='ml-3'>{icon}</View>}
      </View>
    </Pressable>
  )
}
