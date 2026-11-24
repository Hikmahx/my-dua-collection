import { useAddDuaColors } from '@/hooks/use-add-dua-colors'
import { useArabicFont } from '@/hooks/use-arabic-font'
import { useT } from '@/hooks/use-t'
import tw from '@/lib/tailwind'
import type { ReactNode, Ref } from 'react'
import { Text, TextInput, View, type TextInputProps } from 'react-native'

/**
 * A label above a form control, with the space below that every field of the add-dua form has. `autofilled` adds an
 * "Auto-filled" tag next to the label: the field still holds what the image scan or the AI put there.
 */
export function FormField({
  label,
  children,
  last = false,
  autofilled = false,
}: {
  label: string
  children: ReactNode
  last?: boolean
  autofilled?: boolean
}) {
  const c = useAddDuaColors()
  const t = useT()

  return (
    <View style={tw`${last ? 'mb-8' : 'mb-5'}`}>
      <View style={tw`flex-row items-center justify-between mb-2`}>
        <Text style={tw`text-sm font-semibold ${c.text}`}>{label}</Text>
        {autofilled && (
          <View style={tw`px-2 py-0.5 rounded-full border border-bright-gold`}>
            <Text style={tw`text-[10px] font-semibold text-bright-gold`}>{t('addDua.autofill.tag')}</Text>
          </View>
        )}
      </View>
      {children}
    </View>
  )
}

interface FormInputProps extends TextInputProps {
  /** Arabic text: right to left, in the Arabic font chosen in Settings. */
  arabic?: boolean
  /** To focus the box from code. */
  inputRef?: Ref<TextInput>
}

/** A text box in the look of the add-dua form. */
export function FormInput({ arabic = false, inputRef, style, ...rest }: FormInputProps) {
  const c = useAddDuaColors()
  const arabicFont = useArabicFont()

  return (
    <TextInput
      ref={inputRef}
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
