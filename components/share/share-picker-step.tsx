import { CodeFlow } from '@/components/share/code-flow'
import { KindredGrid } from '@/components/share/kindred-grid'
import { ShareActionsRow } from '@/components/share/share-actions-row'
import { GoldButton } from '@/components/ui/gold-button'
import { SearchField } from '@/components/ui/search-field'
import { useShareColors } from '@/hooks/use-share-colors'
import { useT } from '@/hooks/use-t'
import { useToast } from '@/hooks/use-toast'
import type { ShareCardController } from '@/hooks/use-share-card'
import type { SharePicker } from '@/hooks/use-share-picker'
import tw from '@/lib/tailwind'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'

interface SharePickerStepProps {
  picker: SharePicker
  card: ShareCardController
  /** False when sending to kindred needs a sign-in the user has not done (REQUIRE_SIGN_IN_TO_SHARE). */
  canSendToKindred: boolean
  onOpenCard: () => void
  /** Called right after a share is sent, so the sheet closes at once. */
  onSent: () => void
}

/**
 * The first screen of the share sheet, laid out like Instagram's: the search field with the groups icon
 * fixed at the top, your kindred (or groups) scrolling in the middle, and fixed at the bottom either
 * the row of apps and actions (scrolls sideways) or, once someone is picked, the Send button.
 */
export function SharePickerStep({ picker, card, canSendToKindred, onOpenCard, onSent }: SharePickerStepProps) {
  const c = useShareColors()
  const t = useT()
  const inCodeMode = picker.mode === 'code'
  const toast = useToast()

  /** Sends, says so with a toast (who got it, and who already had it waiting), and closes the sheet. */
  const send = () => {
    const { names, alreadyPending } = picker.send()
    const sentText =
      names.length === 0
        ? undefined
        : names.length === 1
          ? t('share.sentOne', { name: names[0] })
          : t('share.sentMany', { name: names[0], count: names.length - 1 })
    const waitingText = alreadyPending.length > 0 ? t('share.alreadyWaiting', { names: alreadyPending.join(', ') }) : undefined
    const message = [sentText, waitingText].filter(Boolean).join('\n')
    if (message) {
      if (sentText) toast.success(message, !!waitingText)
      else toast.info(message)
    }
    onSent()
  }

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
        {inCodeMode ? null : picker.recipientIds.length > 0 ? (
          <View style={tw`px-[20px] pb-[4px]`}>
            <GoldButton label={t('share.send', picker.pickCounts)} onPress={send} />
          </View>
        ) : (
          <ShareActionsRow card={card} onOpenCard={onOpenCard} />
        )}
      </View>
    </View>
  )
}
