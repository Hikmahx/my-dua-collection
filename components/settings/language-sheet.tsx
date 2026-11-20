import { BottomSheet } from '@/components/ui/bottom-sheet'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, ScrollView, Text, View } from 'react-native'

export interface LanguageSheetOption {
  code: string
  label: string
  /** Small line under the label, e.g. how many duas have a translation in it. */
  sublabel?: string
}

interface LanguageSheetProps {
  visible: boolean
  onClose: () => void
  title: string
  subtitle?: string
  options: LanguageSheetOption[]
  selected: string
  onSelect: (code: string) => void
  /** Small note under the list. */
  footnote?: string
}

/** Bottom sheet with a list of languages to choose from (used for the app and the translation language). */
export function LanguageSheet({ visible, onClose, title, subtitle, options, selected, onSelect, footnote }: LanguageSheetProps) {
  const c = useSettingsColors()

  return (
    <BottomSheet visible={visible} onClose={onClose} backgroundColor={c.body} handleColor={c.muted}>
      <Text style={[tw`font-nunito-extrabold text-[16px] px-6 pt-2`, { color: c.title }]}>{title}</Text>
      {!!subtitle && (
        <Text style={[tw`font-nunito text-[12px] px-6 mt-[3px]`, { color: c.muted }]}>{subtitle}</Text>
      )}

      <ScrollView style={tw`mt-3`} contentContainerStyle={tw`px-4`} showsVerticalScrollIndicator={false}>
        {options.map((option) => {
          const isSelected = option.code === selected
          return (
            <Pressable
              key={option.code}
              onPress={() => {
                onSelect(option.code)
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
              </View>
              {isSelected && <MaterialCommunityIcons name='check-circle' size={22} color={c.accent} />}
            </Pressable>
          )
        })}
        {!!footnote && (
          <Text style={[tw`font-nunito text-[11px] text-center mt-1 mb-2`, { color: c.muted }]}>{footnote}</Text>
        )}
      </ScrollView>
    </BottomSheet>
  )
}
