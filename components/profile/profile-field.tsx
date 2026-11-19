import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { Text, TextInput, View, type TextInputProps } from 'react-native'

interface ProfileFieldProps
  extends Pick<TextInputProps, 'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'maxLength'> {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  /** A message under the field when it is not valid. */
  error?: string
  /** A hint under the field. */
  helper?: string
  /** False shows the value but doesn't let it change (e.g. the email from Google). */
  editable?: boolean
}

/** A labeled text input with an optional hint or error underneath. */
export function ProfileField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helper,
  editable = true,
  ...inputProps
}: ProfileFieldProps) {
  const c = useSettingsColors()

  return (
    <View style={tw`mt-4`}>
      <Text style={[tw`font-nunito-semibold text-[13px] mb-2`, { color: c.title }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        editable={editable}
        accessibilityLabel={label}
        style={[
          tw`h-[46px] rounded-xl px-4 font-nunito text-[14px]`,
          {
            color: c.title,
            backgroundColor: c.field,
            borderWidth: 1,
            borderColor: error ? c.danger : c.fieldBorder,
            opacity: editable ? 1 : 0.6,
          },
        ]}
        {...inputProps}
      />
      {!!(error || helper) && (
        <Text style={[tw`font-nunito text-[11px] mt-[6px]`, { color: error ? c.danger : c.muted }]}>
          {error ?? helper}
        </Text>
      )}
    </View>
  )
}
