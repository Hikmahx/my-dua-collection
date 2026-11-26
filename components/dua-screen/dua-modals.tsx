import { useT } from '@/hooks/use-t'
import { ShareDuaSheet } from '@/components/share/share-dua-sheet'
import { DialogModal } from '@/components/ui/dialog-modal'
import { RichText } from '@/components/ui/rich-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import type { Dua } from '@/redux/reducers/duasSlice'
import { Text } from 'react-native'

export type DuaModalKind = 'share' | 'info'

interface DuaModalsProps {
  /** Which modal is open, if any. */
  kind: DuaModalKind | null
  dua: Dua
  onClose: () => void
}

/** The share sheet of the Dua screen, and the dialog with the dua's virtue. */
export function DuaModals({ kind, dua, onClose }: DuaModalsProps) {
  const isDark = useColorScheme() === 'dark'
  const t = useT()
  const text = tw`font-nunito text-[14px] leading-[21px] ${isDark ? 'text-white' : 'text-dark-text'}`

  return (
    <>
      <ShareDuaSheet visible={kind === 'share'} dua={dua} onClose={onClose} />

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
