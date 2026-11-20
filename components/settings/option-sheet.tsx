import { BottomSheet } from '@/components/ui/bottom-sheet'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'

export interface OptionSheetOption {
  id: string
  label: string
  /** Small line under the label, e.g. how many duas have a translation in a language. */
  sublabel?: string
  /** Anything shown under the label, e.g. a sample of the font. */
  preview?: ReactNode
}

interface OptionSheetProps {
  visible: boolean
  onClose: () => void
  title: string
  subtitle?: string
  options: OptionSheetOption[]
  selected: string
  /** Called with the tapped option's id; the sheet closes after it. */
  onSelect: (id: string) => void
  /** Small note under the list. */
  footnote?: string
}

/**
 * A bottom sheet with a list of options to pick one from: the shared look of the App language,
 * Translation language and Arabic text style pickers.
 */
export function OptionSheet({ visible, onClose, title, subtitle, options, selected, onSelect, footnote }: OptionSheetProps) {
  const c = useSettingsColors()

  return (
    <BottomSheet visible={visible} onClose={onClose} backgroundColor={c.body} handleColor={c.muted}>
      <Text style={[tw`font-nunito-extrabold text-[16px] px-6 pt-2`, { color: c.title }]}>{title}</Text>
      {!!subtitle && <Text style={[tw`font-nunito text-[12px] px-6 mt-[3px]`, { color: c.muted }]}>{subtitle}</Text>}

      <ScrollView style={tw`mt-3`} contentContainerStyle={tw`px-4`} showsVerticalScrollIndicator={false}>
        {options.map((option) => {
          const isSelected = option.id === selected
          return (
            <Pressable
              key={option.id}
              onPress={() => {
                onSelect(option.id)
                onClose()
              }}
              accessibilityRole='radio'
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={option.label}
              style={({ pressed }) => [
                tw`flex-row items-center rounded-xl px-4 py-3 mb-2`,
                {
                  backgroundColor: isSelected ? c.previewBg : c.card,
                  borderWidth: 1,
                  borderColor: isSelected ? c.accent : 'transparent',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={tw`flex-1 pr-3`}>
                <Text style={[tw`font-nunito-semibold text-[14px]`, { color: c.title }]}>{option.label}</Text>
                {!!option.sublabel && (
                  <Text style={[tw`font-nunito text-[11px] mt-[2px]`, { color: c.muted }]}>{option.sublabel}</Text>
                )}
                {option.preview}
              </View>
              {isSelected && <MaterialCommunityIcons name='check-circle' size={22} color={c.accent} />}
            </Pressable>
          )
        })}
        {!!footnote && <Text style={[tw`font-nunito text-[11px] text-center mt-1 mb-2`, { color: c.muted }]}>{footnote}</Text>}
      </ScrollView>
    </BottomSheet>
  )
}
