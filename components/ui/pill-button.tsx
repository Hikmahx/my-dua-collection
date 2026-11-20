import tw from '@/lib/tailwind'
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native'

interface PillButtonProps {
  label: string
  onPress: () => void
  backgroundColor: string
  textColor: string
  /** Adds a 1px border in this color. */
  borderColor?: string
  disabled?: boolean
  /** Extra layout style, e.g. the gap above the button. */
  style?: StyleProp<ViewStyle>
}

/** A full-width, fully rounded 44px button: the Delete / Save / Keep buttons of the collection screens. */
export function PillButton({ label, onPress, backgroundColor, textColor, borderColor, disabled = false, style }: PillButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        tw`h-[44px] rounded-full items-center justify-center`,
        { backgroundColor, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
        borderColor ? { borderWidth: 1, borderColor } : null,
        style,
      ]}
    >
      <Text style={[tw`font-nunito-semibold text-[14px]`, { color: textColor }]}>{label}</Text>
    </Pressable>
  )
}
