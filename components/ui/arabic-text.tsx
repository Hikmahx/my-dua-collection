import type { ArabicFontId } from '@/constants/arabic-fonts'
import { useArabicFont } from '@/hooks/use-arabic-font'
import { Text, type TextProps } from 'react-native'

/**
 * Arabic diacritics sit well above and below the letters. With a tight lineHeight the text box
 * clips them flat, so every Arabic line gets this much room. Use <ArabicText> instead of a raw Text.
 */
export const ARABIC_LINE_HEIGHT = 1.9

interface ArabicTextProps extends TextProps {
  size: number
  color: string
  /** Show this font instead of the one chosen in Settings (used by the picker's previews). */
  fontId?: ArabicFontId
}

/** All Arabic text in the app: it follows the "Arabic text style" chosen in Settings. */
export function ArabicText({ size, color, fontId, style, ...rest }: ArabicTextProps) {
  const font = useArabicFont(fontId)

  return (
    <Text
      {...rest}
      style={[{ fontFamily: font.family, fontSize: size, lineHeight: size * ARABIC_LINE_HEIGHT, color }, style]}
    />
  )
}
