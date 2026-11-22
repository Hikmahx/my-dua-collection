import { useAddDuaColors } from '@/hooks/use-add-dua-colors'
import { useArabicFont } from '@/hooks/use-arabic-font'
import tw from '@/lib/tailwind'
import type { ReactNode } from 'react'
import { Text, TextInput, View, type TextInputProps } from 'react-native'

/** A label above a form control, with the space below that every field of the add-dua form has. */
export function FormField({ label, children, last = false }: { label: string; children: ReactNode; last?: boolean }) {
  const c = useAddDuaColors()

  return (
    <View style={tw`${last ? 'mb-8' : 'mb-5'}`}>
      <Text style={tw`text-sm font-semibold ${c.text} mb-2`}>{label}</Text>
      {children}
    </View>
  )
}

interface FormInputProps extends TextInputProps {
  /** Arabic text: right to left, in the Arabic font chosen in Settings. */
  arabic?: boolean
}

/** A text box in the look of the add-dua form. */
export function FormInput({ arabic = false, style, ...rest }: FormInputProps) {
  const c = useAddDuaColors()
  const arabicFont = useArabicFont()

  return (
    <TextInput
      placeholderTextColor={c.placeholder}
      {...rest}
      style={[
        tw`p-3 rounded-lg border ${c.border} ${c.inputBg} ${c.text}`,
        arabic && { textAlign: 'right', fontFamily: arabicFont.family },
        style,
      ]}
    />
  )
}
