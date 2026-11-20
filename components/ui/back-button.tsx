import { useT } from '@/hooks/use-t'
import { Feather } from '@expo/vector-icons'
import { Pressable } from 'react-native'

/** The back arrow for the left slot of a ScreenHeader. */
export function BackButton({ onPress, color }: { onPress: () => void; color: string }) {
  const t = useT()
  return (
    <Pressable onPress={onPress} hitSlop={12} accessibilityRole='button' accessibilityLabel={t('common.back')}>
      <Feather name='arrow-left' size={24} color={color} />
    </Pressable>
  )
}
