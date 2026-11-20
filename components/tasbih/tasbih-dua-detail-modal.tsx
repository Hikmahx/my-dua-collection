import { useT } from '@/hooks/use-t'
import { ArabicText } from '@/components/ui/arabic-text'
import { GoldButton } from '@/components/ui/gold-button'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import { tasbihArabicSize, type TasbihItem } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'

interface TasbihDuaDetailModalProps {
  visible: boolean
  item: TasbihItem
  /** "Change dua" was pressed (the parent closes this modal and opens the picker). */
  onChangeDua: () => void
  onClose: () => void
}

/**
 * The dua being counted, in full: title, Arabic, transliteration (when the dua has one) and
 * translation, with a "Change dua" button at the bottom. Long duas scroll; the button stays put.
 */
export function TasbihDuaDetailModal({
  visible,
  item,
  onChangeDua,
  onClose,
}: TasbihDuaDetailModalProps) {
  const c = useTasbihColors()
  const t = useT()
  const { width, height } = useWindowDimensions()

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        {/* tap the dimmed area to close (a sibling of the card, so scrolling the card still works) */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t('common.close')} />

        <View
          style={[
            tw`rounded-[20px] p-[22px] border`,
            {
              width: Math.min(width - 48, 400),
              maxHeight: height * 0.8,
              backgroundColor: c.sheetBg,
              borderColor: c.rowBorder,
            },
          ]}
        >
          <View style={tw`flex-row items-start justify-between mb-[14px]`}>
            <Text style={[tw`flex-1 font-nunito-bold text-[17px] mr-[12px]`, { color: c.text }]}>
              {item.title}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel={t('common.close')}>
              <Feather name='x' size={22} color={c.text} />
            </Pressable>
          </View>

          <ScrollView style={tw`shrink`} showsVerticalScrollIndicator={false}>
            <ArabicText
              size={tasbihArabicSize(item.arabic) + 2}
              color={c.arabic}
              style={tw`text-center`}
            >
              {item.arabic}
            </ArabicText>

            {!!item.transliteration && (
              <Text
                style={[
                  tw`font-berkshire text-[16px] leading-[24px] text-center mt-[10px]`,
                  { color: c.translit },
                ]}
              >
                {item.transliteration}
              </Text>
            )}

            <Text
              style={[
                tw`font-nunito text-[14px] leading-[21px] text-center mt-[12px]`,
                { color: c.translation },
              ]}
            >
              {item.translation}
            </Text>
          </ScrollView>

          <GoldButton label={t('tasbih.changeDua')} onPress={onChangeDua} style={tw`mt-[20px]`} />
        </View>
      </View>
    </Modal>
  )
}
