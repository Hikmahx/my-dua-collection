import {
  CameraIcon,
  FormIcon,
  SparkleIcon,
} from '@/components/icons/AddDuaOptionIcons'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { Pressable, Text, View } from 'react-native'

export type AddDuaOptionType = 'upload' | 'ai' | 'manual'

export interface AddDuaOptionRowProps {
  type: AddDuaOptionType
  title: string
  description: string
  onPress: () => void
}

function OptionIcon({
  type,
  size = 24,
}: {
  type: AddDuaOptionType
  size?: number
}) {
  switch (type) {
    case 'upload':
      return <CameraIcon size={size} />
    case 'ai':
      return <SparkleIcon size={size} />
    case 'manual':
      return <FormIcon size={size} />
  }
}

/** Single row for the add-dua modal: icon, title, description, arrow. */
export function AddDuaOptionRow({
  type,
  title,
  description,
  onPress,
}: AddDuaOptionRowProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const textColor = isDark ? 'text-light-grayish-text' : 'text-dark-text'
  const descColor = isDark
    ? 'text-light-grayish-text-muted'
    : 'text-dark-grayish-text'
  const arrowColor = isDark ? '#9BA1A6' : '#687076'

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [tw`flex-row items-center py-4 px-1`, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={tw`w-12 h-12 rounded-full border-2 border-bright-gold items-center justify-center mr-4`}>
        <OptionIcon type={type} size={24} />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`font-semibold text-base ${textColor}`}>{title}</Text>
        <Text style={tw`text-sm mt-0.5 ${descColor}`}>{description}</Text>
      </View>
      <View
        style={[tw`w-8 h-8 rounded-full items-center justify-center`, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0' }]}
      >
        <Text style={{ color: arrowColor, fontSize: 16, fontWeight: '600' }}>
          ›
        </Text>
      </View>
    </Pressable>
  )
}
