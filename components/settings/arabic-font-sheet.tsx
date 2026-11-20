import { OptionSheet } from '@/components/settings/option-sheet'
import { ArabicText } from '@/components/ui/arabic-text'
import { ARABIC_FONT_OPTIONS, isArabicFontId } from '@/constants/arabic-fonts'
import { FONT_PREVIEW } from '@/constants/settings-config'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useT } from '@/hooks/use-t'
import tw from '@/lib/tailwind'
import { setArabicFont } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'

interface ArabicFontSheetProps {
  visible: boolean
  onClose: () => void
}

/** Bottom sheet with the five Arabic text styles, each previewed in its own font. Tap one to apply it. */
export function ArabicFontSheet({ visible, onClose }: ArabicFontSheetProps) {
  const t = useT()
  const c = useSettingsColors()
  const dispatch = useDispatch()
  const selected = useSelector((state: RootState) => state.settings.arabicFont)

  const options = ARABIC_FONT_OPTIONS.map(({ id, label }) => ({
    id,
    label,
    preview: (
      <ArabicText fontId={id} size={22} color={c.previewArabic} style={tw`text-left`}>
        {FONT_PREVIEW.arabic}
      </ArabicText>
    ),
  }))

  return (
    <OptionSheet
      visible={visible}
      onClose={onClose}
      title={t('arabicStyle.title')}
      subtitle={t('arabicStyle.subtitle')}
      options={options}
      selected={selected}
      onSelect={(id) => isArabicFontId(id) && dispatch(setArabicFont(id))}
    />
  )
}
