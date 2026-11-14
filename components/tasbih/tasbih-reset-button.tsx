import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import { Pressable, Text } from 'react-native'

/** Small "Reset" link under the counter. Dimmed while the count is 0. */
export function TasbihResetButton({ disabled, onPress }: { disabled: boolean; onPress: () => void }) {
  const c = useTasbihColors()
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={12}
      accessibilityRole='button'
      accessibilityLabel='Reset counter'
      style={({ pressed }) => [
        tw`flex-row items-center`,
        { opacity: disabled ? 0.4 : pressed ? 0.7 : 1 },
      ]}
    >
      <Feather name='rotate-ccw' size={11} color={c.muted} />
      <Text style={[tw`font-nunito text-[10px] ml-[6px]`, { color: c.muted }]}>Reset</Text>
    </Pressable>
  )
}
