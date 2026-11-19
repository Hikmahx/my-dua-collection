import { useCollectionEditColors } from '@/hooks/use-collection-edit-colors'
import tw from '@/lib/tailwind'
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native'

interface DeleteCollectionDialogProps {
  visible: boolean
  collectionName: string
  /** How many duas are in the collection (they stay in the dua library). */
  duaCount: number
  onDelete: () => void
  onKeep: () => void
}

const keepSentence = (count: number) => {
  if (count === 0) return ''
  if (count === 1) return ' The dua will still be available in the dua library.'
  return ` The ${count} duas will still be available in the dua library.`
}

/**
 * "Delete <name>?" – asks before a collection is deleted. Deleting removes the collection and its
 * order, never the duas. Tapping outside or the back button keeps the collection.
 */
export function DeleteCollectionDialog({ visible, collectionName, duaCount, onDelete, onKeep }: DeleteCollectionDialogProps) {
  const c = useCollectionEditColors().dialog
  const { width } = useWindowDimensions()

  return (
    <Modal visible={visible} transparent animationType='fade' statusBarTranslucent onRequestClose={onKeep}>
      <Pressable style={[tw`flex-1 items-center justify-center`, { backgroundColor: c.backdrop }]} onPress={onKeep}>
        <View
          // swallow touches so tapping the card itself doesn't dismiss it
          onStartShouldSetResponder={() => true}
          accessibilityViewIsModal
          style={[
            tw`rounded-[20px] border px-[20px] pt-[24px] pb-[28px]`,
            { width: Math.min(width - 32, 400), backgroundColor: c.card, borderColor: c.border },
          ]}
        >
          <Text numberOfLines={2} style={[tw`font-nunito-extrabold text-[20px] leading-[28px]`, { color: c.title }]}>
            Delete {collectionName}?
          </Text>
          <Text style={[tw`font-nunito text-[14px] leading-[20px] mt-[12px]`, { color: c.body }]}>
            {`This permanently deletes your collection and its order.${keepSentence(duaCount)}`}
          </Text>

          <Pressable
            onPress={onDelete}
            accessibilityRole='button'
            style={({ pressed }) => [
              tw`h-[42px] rounded-[12px] items-center justify-center mt-[40px]`,
              { backgroundColor: c.destructiveBg, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[tw`font-nunito-semibold text-[14px]`, { color: c.destructiveText }]}>Delete collection</Text>
          </Pressable>
          <Pressable
            onPress={onKeep}
            accessibilityRole='button'
            style={({ pressed }) => [
              tw`h-[42px] rounded-[12px] items-center justify-center mt-[14px]`,
              { backgroundColor: c.keepBg, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[tw`font-nunito-semibold text-[14px]`, { color: c.keepText }]}>Keep collection</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}
