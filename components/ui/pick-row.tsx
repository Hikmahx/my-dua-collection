import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'

interface PickRowProps {
  selected: boolean
  onPress: () => void
  children: ReactNode
}

/** One choice in a picker: a rounded row with a gold border and a tick when it is selected (the Tasbih "Choose a dua" rows). */
export function PickRow({ selected, onPress, children }: PickRowProps) {
  const c = useTasbihColors()

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        tw`flex-row items-center rounded-[14px] px-[16px] py-[10px] mb-[8px] border`,
        {
          backgroundColor: c.rowBg,
          borderColor: selected ? c.arc : c.rowBorder,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={tw`flex-1`}>{children}</View>
      {selected && <Feather name='check' size={18} color={c.arc} style={tw`ml-[12px]`} />}
    </Pressable>
  )
}
