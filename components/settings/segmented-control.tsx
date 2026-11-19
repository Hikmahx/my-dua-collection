import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { Pressable, Text, View } from 'react-native'

interface SegmentedControlProps<T extends string> {
  options: { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
  accessibilityLabel: string
}

/** A pill with two or more options side by side; the chosen one is filled. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const c = useSettingsColors()

  return (
    <View
      accessibilityRole='radiogroup'
      accessibilityLabel={accessibilityLabel}
      style={[tw`flex-row rounded-xl p-[3px]`, { backgroundColor: c.field, borderWidth: 1, borderColor: c.fieldBorder }]}
    >
      {options.map((option) => {
        const selected = option.id === value
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            accessibilityRole='radio'
            accessibilityState={{ selected }}
            style={[tw`flex-1 h-[36px] rounded-[9px] items-center justify-center`, selected && { backgroundColor: c.accent }]}
          >
            <Text
              style={[
                tw`font-nunito-semibold text-[13px]`,
                { color: selected ? c.toggleThumbOn : c.muted },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
