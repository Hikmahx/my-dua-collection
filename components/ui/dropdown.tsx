import { PickerSheet } from '@/components/ui/picker-sheet'
import { PickRow } from '@/components/ui/pick-row'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

export interface DropdownOption<T extends string> {
  value: T
  label: string
}

interface DropdownProps<T extends string> {
  /** Shown above the field and as the title of the list. */
  label: string
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
}

/**
 * A field that shows the chosen option with a chevron and opens the options in the Tasbih-style
 * sheet. Picking one closes it. For a short fixed list of choices.
 */
export function Dropdown<T extends string>({ label, value, options, onChange }: DropdownProps<T>) {
  const c = useTasbihColors()
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <View>
      <Text style={[tw`font-nunito-semibold text-[14px] mb-[8px]`, { color: c.text }]}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole='button'
        accessibilityLabel={`${label}: ${selected?.label ?? ''}`}
        style={({ pressed }) => [
          tw`flex-row items-center justify-between rounded-[12px] px-[14px] py-[12px] border`,
          { backgroundColor: c.rowBg, borderColor: c.rowBorder, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={[tw`font-nunito-semibold text-[15px]`, { color: c.text }]}>{selected?.label}</Text>
        <MaterialCommunityIcons name='chevron-down' size={20} color={c.arc} />
      </Pressable>

      <PickerSheet visible={open} title={label} height='auto' onClose={() => setOpen(false)}>
        <View style={tw`px-[16px] pb-[28px]`}>
          {options.map((option) => (
            <PickRow
              key={option.value}
              selected={option.value === value}
              onPress={() => {
                setOpen(false)
                onChange(option.value)
              }}
            >
              <Text style={[tw`font-nunito-semibold text-[15px]`, { color: c.text }]}>{option.label}</Text>
            </PickRow>
          ))}
        </View>
      </PickerSheet>
    </View>
  )
}
