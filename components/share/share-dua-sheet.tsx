import { ShareCard } from '@/components/share/share-card'
import { ShareCardStep } from '@/components/share/share-card-step'
import { SharePickerStep } from '@/components/share/share-picker-step'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { CARD_BASE_WIDTH, REQUIRE_SIGN_IN_TO_SHARE } from '@/constants/share-config'
import { useProfile } from '@/hooks/use-profile'
import { useShareCard } from '@/hooks/use-share-card'
import { useShareColors } from '@/hooks/use-share-colors'
import { useSharePicker } from '@/hooks/use-share-picker'
import type { Dua } from '@/redux/reducers/duasSlice'
import { useEffect, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'

interface ShareDuaSheetProps {
  visible: boolean
  dua: Dua
  onClose: () => void
}

/**
 * The Share sheet of the Dua screen (laid out like Instagram's share sheet). The first screen picks who
 * to send the dua to (your kindred, a group, or someone by their user code) and has the row of apps and
 * actions: WhatsApp, Instagram, Facebook, X, Telegram, Messenger, Save image, Copy text, Card and More.
 * Everything that is sent as a picture uses the dua's card, which the second screen ("Card") lets the
 * person restyle. The card that is photographed is drawn off screen at a fixed size, so the picture
 * looks the same on every phone.
 */
export function ShareDuaSheet({ visible, dua, onClose }: ShareDuaSheetProps) {
  const c = useShareColors()
  const { height } = useWindowDimensions()
  const profile = useProfile()
  const card = useShareCard(dua)
  const picker = useSharePicker({ type: 'dua', id: dua.id })
  const [step, setStep] = useState<'share' | 'card'>('share')
  const { reset } = picker

  // opening the sheet again starts from the first screen with nobody picked
  useEffect(() => {
    if (!visible) {
      setStep('share')
      reset()
    }
  }, [visible, reset])

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      backgroundColor={c.sheetBg}
      handleColor={c.handle}
      height={Math.round(height * 0.78)}
      behind={
        <View pointerEvents='none' style={{ position: 'absolute', top: 0, left: -(CARD_BASE_WIDTH + 200), width: CARD_BASE_WIDTH }}>
          <ShareCard content={card.content} theme={card.theme} width={CARD_BASE_WIDTH} viewRef={card.cardRef} onSize={card.onCardSize} />
        </View>
      }
    >
      {step === 'share' ? (
        <SharePickerStep
          picker={picker}
          card={card}
          canSendToKindred={!REQUIRE_SIGN_IN_TO_SHARE || profile.isSignedIn}
          onOpenCard={() => setStep('card')}
        />
      ) : (
        <ShareCardStep
          card={card}
          available={{
            showTransliteration: !!dua.transliteration?.trim(),
            showTranslation: Object.values(dua.translations).some((text) => text.trim().length > 0),
            showReference: !!dua.source,
          }}
          onBack={() => setStep('share')}
        />
      )}
    </BottomSheet>
  )
}
