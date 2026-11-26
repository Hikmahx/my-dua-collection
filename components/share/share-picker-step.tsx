import { CodeFlow } from '@/components/share/code-flow'
import { KindredGrid } from '@/components/share/kindred-grid'
import { ShareActionsRow } from '@/components/share/share-actions-row'
import { GoldButton } from '@/components/ui/gold-button'
import { SearchField } from '@/components/ui/search-field'
import { useShareColors } from '@/hooks/use-share-colors'
import { useT } from '@/hooks/use-t'
import type { ShareCardController } from '@/hooks/use-share-card'
import type { SharePicker } from '@/hooks/use-share-picker'
import tw from '@/lib/tailwind'
import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'

const SENT_NOTICE_MS = 4000

interface SharePickerStepProps {
  picker: SharePicker
  card: ShareCardController
  /** False when sending to kindred needs a sign-in the user has not done (REQUIRE_SIGN_IN_TO_SHARE). */
  canSendToKindred: boolean
  onOpenCard: () => void
}

/** A line under the grid: the result of the last action, or who the dua was just sent to. */
function Notice({ kind, text, extra }: { kind: 'success' | 'error'; text: string; extra?: string }) {
  const c = useShareColors()
  const color = kind === 'success' ? c.success : c.danger
  return (
    <View accessibilityLiveRegion='polite' style={tw`px-[20px] pb-[10px] items-center`}>
      <View style={tw`flex-row items-center`}>
        <Ionicons name={kind === 'success' ? 'checkmark-circle' : 'alert-circle'} size={16} color={color} />
        <Text style={[tw`font-nunito-semibold text-[13px] ml-[6px] flex-shrink`, { color }]}>{text}</Text>
      </View>
      {extra ? <Text style={[tw`font-nunito text-[12px] mt-[2px] text-center`, { color: c.muted }]}>{extra}</Text> : null}
    </View>
  )
}

/**
 * The first screen of the share sheet, laid out like Instagram's: the search field with the groups icon
 * fixed at the top, your kindred (or groups) scrolling in the middle, and fixed at the bottom either
 * the row of apps and actions (scrolls sideways) or, once someone is picked, the Send button.
 */
export function SharePickerStep({ picker, card, canSendToKindred, onOpenCard }: SharePickerStepProps) {
  const c = useShareColors()
  const t = useT()
  const inCodeMode = picker.mode === 'code'
  const { sent, dismissSent } = picker

  useEffect(() => {
    if (!sent) return
    const timer = setTimeout(dismissSent, SENT_NOTICE_MS)
    return () => clearTimeout(timer)
  }, [sent, dismissSent])

  const sentText = sent
    ? sent.names.length === 0
      ? undefined
      : sent.names.length === 1
        ? t('share.sentOne', { name: sent.names[0] })
        : t('share.sentMany', { name: sent.names[0], count: sent.names.length - 1 })
    : undefined

  return (
    <View style={tw`flex-1`}>
      {/* fixed at the top: search and the groups icon */}
      <View style={tw`flex-row items-center px-[16px] pb-[8px] pt-[4px]`}>
        <SearchField
          value={picker.query}
          onChangeText={picker.setQuery}
          placeholder={inCodeMode ? t('share.searchCode') : t('share.searchKindred')}
          autoCapitalize={inCodeMode ? 'characters' : undefined}
          maxLength={inCodeMode ? 12 : undefined}
          returnKeyType={inCodeMode ? 'go' : 'search'}
          onSubmitEditing={inCodeMode ? picker.findByCode : undefined}
          style={tw`flex-1`}
        />
        <Pressable
          onPress={() => picker.setMode(picker.mode === 'groups' ? 'people' : 'groups')}
          accessibilityRole='button'
          accessibilityLabel={picker.mode === 'groups' ? t('share.showKindred') : t('share.showGroups')}
          accessibilityState={{ selected: picker.mode === 'groups' }}
          style={[
            tw`w-[46px] h-[46px] rounded-full items-center justify-center ml-[10px]`,
            { backgroundColor: picker.mode === 'groups' ? c.chipActiveBg : c.chipBg },
          ]}
        >
          <Ionicons name='people' size={22} color={picker.mode === 'groups' ? c.chipActiveText : c.accent} />
        </Pressable>
      </View>

      {/* the middle scrolls */}
      <View style={tw`flex-1`}>
        {!canSendToKindred ? (
          <View style={tw`px-[28px] pt-[28px] items-center`}>
            <Text style={[tw`font-nunito text-[14px] leading-[20px] text-center`, { color: c.muted }]}>{t('share.signInRequired')}</Text>
          </View>
        ) : inCodeMode ? (
          <CodeFlow picker={picker} />
        ) : (
          <KindredGrid picker={picker} />
        )}
      </View>

      {/* fixed at the bottom */}
      <View style={[tw`pt-[10px]`, { borderTopWidth: 1, borderTopColor: c.rowBorder }]}>
        {card.status ? <Notice kind={card.status.kind} text={card.status.message} /> : null}
        {sentText ? (
          <Notice
            kind='success'
            text={sentText}
            extra={sent && sent.alreadyPending.length > 0 ? t('share.alreadyWaiting', { names: sent.alreadyPending.join(', ') }) : undefined}
          />
        ) : null}

        {inCodeMode ? null : picker.recipientIds.length > 0 ? (
          <View style={tw`px-[20px] pb-[4px]`}>
            <GoldButton label={t('share.send', picker.pickCounts)} onPress={picker.send} />
          </View>
        ) : (
          <ShareActionsRow card={card} onOpenCard={onOpenCard} />
        )}
      </View>
    </View>
  )
}
