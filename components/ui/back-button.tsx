import { Feather } from '@expo/vector-icons'
import { Pressable } from 'react-native'

/** The back arrow for the left slot of a ScreenHeader. */
export function BackButton({ onPress, color }: { onPress: () => void; color: string }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} accessibilityRole='button' accessibilityLabel='Back'>
      <Feather name='arrow-left' size={24} color={color} />
    </Pressable>
  )
}
