import { useT } from '@/hooks/use-t'
import { DialogModal } from '@/components/ui/dialog-modal'
import { GoldButton } from '@/components/ui/gold-button'
import { RichText } from '@/components/ui/rich-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { duaShareText } from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import type { Dua } from '@/redux/reducers/duasSlice'
import type { RootState } from '@/redux/store'
import { Share, Text } from 'react-native'
import { useSelector } from 'react-redux'

export type DuaModalKind = 'share' | 'info'

interface DuaModalsProps {
  /** Which modal is open, if any. */
  kind: DuaModalKind | null
  dua: Dua
  onClose: () => void
}

/** The two dialogs of the Dua screen: share, and the dua's virtue. */
export function DuaModals({ kind, dua, onClose }: DuaModalsProps) {
  const isDark = useColorScheme() === 'dark'
  const t = useT()
  const language = useSelector((state: RootState) => state.settings.translationLanguage)
  const text = tw`font-nunito text-[14px] leading-[21px] ${isDark ? 'text-white' : 'text-dark-text'}`
  const message = duaShareText(dua, language)

  return (
    <>
      <DialogModal
        visible={kind === 'share'}
        title={t('duaModals.share')}
        onClose={onClose}
        footer={
          <GoldButton
            label={t('common.share')}
            onPress={async () => {
              await Share.share({ message })
              onClose()
            }}
          />
        }
      >
        <Text style={text} selectable>
          {message}
        </Text>
      </DialogModal>

      <DialogModal visible={kind === 'info'} title={t('duaModals.virtue')} onClose={onClose}>
        {dua.info ? (
          <RichText html={dua.info} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
        ) : (
          <Text style={text}>{t('duaModals.noVirtue')}</Text>
        )}
      </DialogModal>
    </>
  )
}
