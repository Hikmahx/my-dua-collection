import { ArabicText } from '@/components/ui/arabic-text'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import { useT } from '@/hooks/use-t'
import { formatSourceLine } from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import type { Dua } from '@/redux/reducers/duasSlice'
import { Text, View } from 'react-native'

interface DuplicateDuaModalProps {
  /** The dua that already exists. The modal is open while this is set. */
  dua: Dua | undefined
  /** "Select it": use the existing dua instead. */
  onSelectExisting: () => void
  /** "No, add it": go on and add the new dua anyway. */
  onAddAnyway: () => void
  /** Tapping outside or the back button: close and add nothing. */
  onDismiss: () => void
}

/** Tells the user the dua they are adding already exists (title, start of the Arabic, source) and offers to select it instead. */
export function DuplicateDuaModal({ dua, onSelectExisting, onAddAnyway, onDismiss }: DuplicateDuaModalProps) {
  const c = useTasbihColors()
  const t = useT()
  const source = dua ? formatSourceLine(dua) : undefined

  return (
    <ConfirmModal
      visible={!!dua}
      title={t('duplicateDua.title')}
      message={t('duplicateDua.message')}
      confirmLabel={t('duplicateDua.select')}
      cancelLabel={t('duplicateDua.addAnyway')}
      onConfirm={onSelectExisting}
      onCancel={onAddAnyway}
      onDismiss={onDismiss}
    >
      {dua && (
        <View style={[tw`rounded-[12px] px-[14px] py-[10px] border`, { backgroundColor: c.rowBg, borderColor: c.rowBorder }]}>
          <Text numberOfLines={1} style={[tw`font-nunito-semibold text-[15px]`, { color: c.text }]}>
            {dua.title}
          </Text>
          <ArabicText numberOfLines={2} size={18} color={c.arabic} style={tw`text-right`}>
            {dua.arabicText}
          </ArabicText>
          {source && <Text style={[tw`font-nunito text-[12px]`, { color: c.translation }]}>{source}</Text>}
        </View>
      )}
    </ConfirmModal>
  )
}
