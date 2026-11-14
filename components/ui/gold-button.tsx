import tw from '@/lib/tailwind'
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native'

interface GoldButtonProps {
  label: string
  onPress: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

/** The gold pill button used for the main action of a dialog. */
export function GoldButton({ label, onPress, disabled = false, style }: GoldButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        tw`h-[44px] rounded-full items-center justify-center bg-bright-gold`,
        { opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={tw`font-nunito-bold text-[14px] text-dark-text`}>{label}</Text>
    </Pressable>
  )
}
