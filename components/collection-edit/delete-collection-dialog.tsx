import { useT } from '@/hooks/use-t'
import { PillButton } from '@/components/ui/pill-button'
import { useCollectionEditColors } from '@/hooks/use-collection-edit-colors'
import tw from '@/lib/tailwind'
import type { TFunction } from '@/locales'
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native'

interface DeleteCollectionDialogProps {
  visible: boolean
  collectionName: string
  /** How many duas are in the collection (they stay in the dua library). */
  duaCount: number
  onDelete: () => void
  onKeep: () => void
}

const keepSentence = (count: number, t: TFunction) => {
  if (count === 0) return ''
  if (count === 1) return t('deleteCollection.keepOne')
  return t('deleteCollection.keepMany', { count })
}

/**
 * "Delete <name>?" – asks before a collection is deleted. Deleting removes the collection and its
 * order, never the duas. Tapping outside or the back button keeps the collection.
 */
export function DeleteCollectionDialog({ visible, collectionName, duaCount, onDelete, onKeep }: DeleteCollectionDialogProps) {
  const c = useCollectionEditColors().dialog
  const { width } = useWindowDimensions()
  const t = useT()

  return (
    <Modal visible={visible} transparent animationType='fade' statusBarTranslucent onRequestClose={onKeep}>
      <Pressable style={[tw`flex-1 items-center justify-center`, { backgroundColor: c.backdrop }]} onPress={onKeep}>
        <View
          // swallow touches so tapping the card itself doesn't dismiss it
          onStartShouldSetResponder={() => true}
          accessibilityViewIsModal
          style={[
            tw`rounded-[24px] border px-[20px] pt-[24px] pb-[26px]`,
            { width: Math.min(width - 32, 400), backgroundColor: c.card, borderColor: c.border },
          ]}
        >
          <Text numberOfLines={2} style={[tw`font-nunito-extrabold text-[20px] leading-[28px]`, { color: c.title }]}>
            {t('deleteCollection.title', { name: collectionName })}
          </Text>
          <Text style={[tw`font-nunito text-[14px] leading-[20px] mt-[12px]`, { color: c.body }]}>
            {`${t('deleteCollection.body')}${keepSentence(duaCount, t)}`}
          </Text>

          <PillButton
            label={t('deleteCollection.confirm')}
            onPress={onDelete}
            backgroundColor={c.destructiveBg}
            textColor={c.destructiveText}
            style={tw`mt-[40px]`}
          />
          <PillButton
            label={t('deleteCollection.keep')}
            onPress={onKeep}
            backgroundColor={c.keepBg}
            textColor={c.keepText}
            style={tw`mt-[12px]`}
          />
        </View>
      </Pressable>
    </Modal>
  )
}
