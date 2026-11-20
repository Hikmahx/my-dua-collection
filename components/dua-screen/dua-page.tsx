import { useT } from '@/hooks/use-t'
import { ArabicText } from '@/components/ui/arabic-text'
import { useDuaScreenColors } from '@/hooks/use-dua-screen-colors'
import { formatSourceLine, getTranslation } from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import type { Dua } from '@/redux/reducers/duasSlice'
import type { RootState } from '@/redux/store'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

interface DuaPageProps {
  dua: Dua
  /** 1-based position and the list length, for the "4/11" pill. */
  position: number
  total: number
  width: number
  onOpenVirtue: () => void
}

/** One dua, full page: pill, title, source, Arabic, transliteration, translation, "View Dua Virtue". */
export function DuaPage({ dua, position, total, width, onOpenVirtue }: DuaPageProps) {
  const c = useDuaScreenColors()
  const t = useT()
  const { fontSizes, translationLanguage: language, showTransliteration } = useSelector((state: RootState) => state.settings)
  const source = formatSourceLine(dua)

  return (
    <ScrollView
      style={{ width }}
      contentContainerStyle={tw`px-[14px] pt-[14px] pb-[40px]`}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[tw`self-start h-[28px] px-[12px] rounded-full justify-center`, { backgroundColor: c.accent }]}
      >
        <Text style={[tw`font-nunito-semibold text-[12px]`, { color: c.pillText }]}>
          {position}/{total}
        </Text>
      </View>

      {/* the source sits at the right, level with the first line of the title */}
      <View style={tw`mt-[16px] flex-row items-start justify-between`}>
        <Text style={[tw`flex-1 mr-[12px] font-berkshire text-[24px] leading-[32px]`, { color: c.title }]}>
          {dua.title}
        </Text>
        {!!source && (
          <Text style={[tw`mt-[8px] font-nunito text-[10px]`, { color: c.muted }]}>{source}</Text>
        )}
      </View>

      <ArabicText size={fontSizes.arabic} color={c.text} style={tw`text-right mt-[16px]`}>
        {dua.arabicText}
      </ArabicText>

      {showTransliteration && !!dua.transliteration && (
        <Text
          style={[
            tw`font-nunito mt-[24px]`,
            { color: c.text, fontSize: fontSizes.transliteration, lineHeight: fontSizes.transliteration * 1.6 },
          ]}
        >
          {dua.transliteration}
        </Text>
      )}

      <Text
        style={[
          tw`font-nunito mt-[24px]`,
          { color: c.text, fontSize: fontSizes.translation, lineHeight: fontSizes.translation * 1.65 },
        ]}
      >
        {getTranslation(dua, language)}
      </Text>

      <Pressable
        onPress={onOpenVirtue}
        accessibilityRole='button'
        style={({ pressed }) => [
          tw`self-start mt-[24px] h-[32px] px-[14px] rounded-full justify-center`,
          { backgroundColor: c.button, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[tw`font-nunito-semibold text-[12px]`, { color: c.buttonText }]}>{t('duaPage.viewVirtue')}</Text>
      </Pressable>
    </ScrollView>
  )
}
