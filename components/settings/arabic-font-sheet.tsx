import { BottomSheet } from '@/components/ui/bottom-sheet'
import { ArabicText } from '@/components/ui/arabic-text'
import { ARABIC_FONT_OPTIONS } from '@/constants/arabic-fonts'
import { FONT_PREVIEW } from '@/constants/settings-config'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { setArabicFont } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

interface ArabicFontSheetProps {
  visible: boolean
  onClose: () => void
}

/** Bottom sheet with the five Arabic text styles, each previewed in its own font. Tap one to apply it. */
export function ArabicFontSheet({ visible, onClose }: ArabicFontSheetProps) {
  const c = useSettingsColors()
  const dispatch = useDispatch()
  const selected = useSelector((state: RootState) => state.settings.arabicFont)

  return (
    <BottomSheet visible={visible} onClose={onClose} backgroundColor={c.body} handleColor={c.muted}>
      <Text style={[tw`font-nunito-extrabold text-[16px] px-6 pt-2`, { color: c.title }]}>Arabic text style</Text>
      <Text style={[tw`font-nunito text-[12px] px-6 mt-[3px] mb-3`, { color: c.muted }]}>
        Applies to all Arabic text in the app
      </Text>

      <View style={tw`px-4`}>
        {ARABIC_FONT_OPTIONS.map((option) => {
          const isSelected = option.id === selected
          return (
            <Pressable
              key={option.id}
              onPress={() => {
                dispatch(setArabicFont(option.id))
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
                <ArabicText fontId={option.id} size={22} color={c.previewArabic} style={tw`text-left`}>
                  {FONT_PREVIEW.arabic}
                </ArabicText>
              </View>
              {isSelected && <MaterialCommunityIcons name='check-circle' size={22} color={c.accent} />}
            </Pressable>
          )
        })}
      </View>
    </BottomSheet>
  )
}
