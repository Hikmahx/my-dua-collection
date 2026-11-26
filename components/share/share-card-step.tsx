import { ShareCard } from '@/components/share/share-card'
import { GoldButton } from '@/components/ui/gold-button'
import { PillButton } from '@/components/ui/pill-button'
import { CARD_THEME_IDS, type CardOptions, type CardThemeId } from '@/constants/share-config'
import { CARD_THEMES } from '@/constants/share-theme'
import { useShareColors } from '@/hooks/use-share-colors'
import { useT } from '@/hooks/use-t'
import type { ShareCardController } from '@/hooks/use-share-card'
import type { TranslationKey } from '@/locales'
import tw from '@/lib/tailwind'
import { Feather, Ionicons } from '@expo/vector-icons'
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native'

const THEME_LABELS: Record<CardThemeId, TranslationKey> = {
  emerald: 'share.card.theme.emerald',
  night: 'share.card.theme.night',
  cream: 'share.card.theme.cream',
}

const OPTION_LABELS: Record<keyof CardOptions, TranslationKey> = {
  showTransliteration: 'share.card.transliteration',
  showTranslation: 'share.card.translation',
  showReference: 'share.card.reference',
}

interface ShareCardStepProps {
  card: ShareCardController
  /** Which of the optional parts this dua has (a dua with no transliteration has nothing to switch). */
  available: Record<keyof CardOptions, boolean>
  onBack: () => void
}

/** The second screen of the share sheet: the card's preview, its style, and what it shows, with Save and Share under it. */
export function ShareCardStep({ card, available, onBack }: ShareCardStepProps) {
  const c = useShareColors()
  const t = useT()
  const { width } = useWindowDimensions()
  const previewWidth = Math.min(width - 96, 300)
  const optionKeys = (Object.keys(OPTION_LABELS) as (keyof CardOptions)[]).filter((key) => available[key])

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row items-center px-[16px] pb-[8px]`}>
        <Pressable onPress={onBack} hitSlop={12} accessibilityRole='button' accessibilityLabel={t('common.back')}>
          <Feather name='chevron-left' size={24} color={c.text} />
        </Pressable>
        <Text style={[tw`font-nunito-bold text-[17px] ml-[8px]`, { color: c.text }]}>{t('share.card.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={tw`items-center px-[16px] pb-[12px]`} showsVerticalScrollIndicator={false}>
        <View
          style={{
            borderRadius: 14,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}
        >
          <ShareCard content={card.content} theme={card.theme} width={previewWidth} radius={14} />
        </View>

        <Text style={[tw`font-nunito-semibold text-[12px] self-start mt-[18px] mb-[8px]`, { color: c.muted }]}>{t('share.card.style')}</Text>
        <View style={tw`flex-row self-stretch`}>
          {CARD_THEME_IDS.map((id) => {
            const theme = CARD_THEMES[id]
            const on = card.themeId === id
            return (
              <Pressable
                key={id}
                onPress={() => card.setThemeId(id)}
                accessibilityRole='button'
                accessibilityState={{ selected: on }}
                style={tw`items-center mr-[16px]`}
              >
                <View
                  style={[
                    tw`w-[48px] h-[48px] rounded-full overflow-hidden items-center justify-center`,
                    { borderWidth: 2, borderColor: on ? c.checkOn : c.rowBorder, backgroundColor: theme.from },
                  ]}
                >
                  <View style={{ position: 'absolute', right: 0, bottom: 0, width: 34, height: 34, borderRadius: 17, backgroundColor: theme.to }} />
                  {on && <Feather name='check' size={18} color={theme.arabic} />}
                </View>
                <Text style={[tw`font-nunito text-[11px] mt-[4px]`, { color: c.text }]}>{t(THEME_LABELS[id])}</Text>
              </Pressable>
            )
          })}
        </View>

        {optionKeys.length > 0 && (
          <>
            <Text style={[tw`font-nunito-semibold text-[12px] self-start mt-[16px] mb-[8px]`, { color: c.muted }]}>{t('share.card.show')}</Text>
            <View style={tw`flex-row flex-wrap self-stretch`}>
              {optionKeys.map((key) => {
                const on = card.options[key]
                return (
                  <Pressable
                    key={key}
                    onPress={() => card.toggleOption(key)}
                    accessibilityRole='switch'
                    accessibilityState={{ checked: on }}
                    style={[tw`h-[34px] pl-[10px] pr-[14px] rounded-full flex-row items-center mr-[8px] mb-[8px]`, { backgroundColor: on ? c.chipActiveBg : c.chipBg }]}
                  >
                    <Ionicons name={on ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={on ? c.chipActiveText : c.chipText} />
                    <Text style={[tw`font-nunito-semibold text-[13px] ml-[6px]`, { color: on ? c.chipActiveText : c.chipText }]}>{t(OPTION_LABELS[key])}</Text>
                  </Pressable>
                )
              })}
            </View>
          </>
        )}
      </ScrollView>

      <View style={[tw`px-[20px] pt-[10px]`, { borderTopWidth: 1, borderTopColor: c.rowBorder }]}>
        <GoldButton label={t('share.card.share')} onPress={card.shareWithSystemSheet} disabled={card.busy !== null} />
        <PillButton
          label={t('share.action.save')}
          onPress={card.saveImage}
          disabled={card.busy !== null}
          backgroundColor='transparent'
          textColor={c.text}
          borderColor={c.rowBorder}
          style={tw`mt-[8px]`}
        />
      </View>
    </View>
  )
}
