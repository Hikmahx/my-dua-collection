import tw from '@/lib/tailwind'
import { Text, type TextProps } from 'react-native'

/**
 * Amiri's diacritics sit well above and below the letters. With a tight lineHeight the text box
 * clips them flat, so every Arabic line gets this much room. Use <ArabicText> instead of a raw Text.
 */
export const ARABIC_LINE_HEIGHT = 1.9

interface ArabicTextProps extends TextProps {
  size: number
  color: string
}

export function ArabicText({ size, color, style, ...rest }: ArabicTextProps) {
  return (
    <Text
      {...rest}
      style={[tw`font-arabic`, { fontSize: size, lineHeight: size * ARABIC_LINE_HEIGHT, color }, style]}
    />
  )
}
