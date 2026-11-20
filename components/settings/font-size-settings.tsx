import { useT } from '@/hooks/use-t'
import { FontSizeSlider } from '@/components/settings/font-size-slider'
import { ArabicText } from '@/components/ui/arabic-text'
import { FONT_PREVIEW, FONT_SIZE_SETTINGS } from '@/constants/settings-config'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { setFontSize } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const FONT_SIZE_LABEL_KEYS = {
  arabic: 'fontSize.arabic',
  translation: 'fontSize.translation',
  transliteration: 'fontSize.transliteration',
} as const

/** The "Font size" block: one slider per text, and a live preview of the three sizes together. */
export function FontSizeSettings() {
  const c = useSettingsColors()
  const dispatch = useDispatch()
  const t = useT()
  const sizes = useSelector((state: RootState) => state.settings.fontSizes)

  return (
    <View style={tw`pt-4 pb-4`}>
      <Text style={[tw`font-nunito-semibold text-[14px]`, { color: c.title }]}>{t('fontSize.title')}</Text>
      <Text style={[tw`font-nunito text-[11px] mt-[3px]`, { color: c.muted }]}>
        {t('fontSize.subtitle')}
      </Text>

      {FONT_SIZE_SETTINGS.map(({ key, min, max }) => (
        <FontSizeSlider
          key={key}
          label={t(FONT_SIZE_LABEL_KEYS[key])}
          value={sizes[key]}
          min={min}
          max={max}
          onChange={(size) => dispatch(setFontSize({ target: key, size }))}
        />
      ))}

      <View style={[tw`rounded-xl items-center px-3 py-2 mt-4`, { backgroundColor: c.previewBg }]}>
        <ArabicText size={sizes.arabic} color={c.previewArabic} style={tw`text-center`}>
          {FONT_PREVIEW.arabic}
        </ArabicText>
        <Text style={[tw`font-nunito text-center`, { fontSize: sizes.translation, color: c.title }]}>
          {FONT_PREVIEW.translation}
        </Text>
        <Text
          style={[tw`font-nunito text-center mt-[2px]`, { fontSize: sizes.transliteration, color: c.muted }]}
        >
          {FONT_PREVIEW.transliteration}
        </Text>
      </View>
    </View>
  )
}
