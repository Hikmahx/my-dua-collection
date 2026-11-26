import { AvatarCircle } from '@/components/avatar/avatar-circle'
import { GroupChips } from '@/components/share/group-chips'
import { GoldButton } from '@/components/ui/gold-button'
import { PillButton } from '@/components/ui/pill-button'
import { useShareColors } from '@/hooks/use-share-colors'
import { useT } from '@/hooks/use-t'
import type { SharePicker } from '@/hooks/use-share-picker'
import type { TranslationKey } from '@/locales'
import { shortName } from '@/lib/kindred'
import tw from '@/lib/tailwind'
import { ScrollView, Text, View } from 'react-native'

const PROBLEM_TEXT: Record<string, TranslationKey> = {
  invalid: 'share.codeInvalid',
  self: 'share.codeSelf',
  notFound: 'share.codeNotFound',
  rateLimited: 'share.codeRateLimited',
}

/**
 * "Add by code", in the middle of the share sheet. The code is typed in the search field above.
 * Steps: type it and tap Find, confirm who was found, then (for someone who is not kindred yet) the
 * "Save as kindred?" question. Whoever is confirmed ends up picked in the grid.
 */
export function CodeFlow({ picker }: { picker: SharePicker }) {
  const c = useShareColors()
  const t = useT()
  const step = picker.codeStep
  const title = tw`font-nunito-bold text-[17px] text-center`
  const body = tw`font-nunito text-[13px] leading-[19px] text-center mt-[6px]`

  return (
    <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={tw`px-[24px] pt-[20px] pb-[16px] items-center`}>
      {step.name === 'enter' && (
        <>
          <Text style={[body, { color: c.muted }]}>{t('share.codeHint')}</Text>
          {step.problem ? (
            <Text accessibilityLiveRegion='polite' style={[tw`font-nunito-semibold text-[13px] leading-[19px] text-center mt-[14px]`, { color: c.danger }]}>
              {t(PROBLEM_TEXT[step.problem])}
            </Text>
          ) : null}
          <View style={tw`self-stretch mt-[18px]`}>
            <GoldButton
              label={step.loading ? t('share.codeFinding') : t('share.codeFind')}
              onPress={picker.findByCode}
              disabled={step.loading || picker.query.trim().length === 0}
            />
          </View>
          <Text onPress={picker.cancelCode} style={[tw`font-nunito-semibold text-[13px] mt-[16px]`, { color: c.accent }]}>
            {t('common.cancel')}
          </Text>
        </>
      )}

      {step.name === 'found' && (
        <>
          <AvatarCircle config={step.user.avatar} size={84} />
          <Text style={[title, tw`mt-[12px]`, { color: c.text }]}>{shortName(step.user)}</Text>
          <Text style={[body, { color: c.muted }]}>{t('share.codeFoundBody')}</Text>
          <View style={tw`self-stretch mt-[18px]`}>
            <GoldButton label={t('share.codeConfirm')} onPress={picker.confirmFound} />
          </View>
          <Text onPress={picker.cancelCode} style={[tw`font-nunito-semibold text-[13px] mt-[16px]`, { color: c.accent }]}>
            {t('common.cancel')}
          </Text>
        </>
      )}

      {step.name === 'save' && (
        <>
          <AvatarCircle config={step.user.avatar} size={64} />
          <Text style={[title, tw`mt-[12px]`, { color: c.text }]}>{t('share.saveTitle', { name: shortName(step.user) })}</Text>
          <Text style={[body, { color: c.muted }]}>{t('share.saveBody')}</Text>
          <View style={tw`mt-[14px]`}>
            <GroupChips selected={step.groups} onToggle={picker.toggleSaveGroup} />
          </View>
          <View style={tw`self-stretch mt-[18px]`}>
            <GoldButton label={t('share.saveYes')} onPress={() => picker.answerSave(true)} />
            <PillButton
              label={t('share.saveNo')}
              onPress={() => picker.answerSave(false)}
              backgroundColor='transparent'
              textColor={c.text}
              borderColor={c.rowBorder}
              style={tw`mt-[10px]`}
            />
          </View>
        </>
      )}
    </ScrollView>
  )
}
