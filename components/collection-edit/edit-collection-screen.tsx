import { useT } from '@/hooks/use-t'
import { DeleteCollectionDialog } from '@/components/collection-edit/delete-collection-dialog'
import { ReorderableDuaList, type ReorderableDua } from '@/components/collection-edit/reorderable-dua-list'
import { BackButton } from '@/components/ui/back-button'
import { PillButton } from '@/components/ui/pill-button'
import { ScreenHeader } from '@/components/ui/screen-header'
import { MAX_COLLECTION_NAME_LENGTH } from '@/constants/collections'
import { useCollectionEditColors } from '@/hooks/use-collection-edit-colors'
import { useCollections } from '@/hooks/use-collections'
import { formatSourceLine } from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import { removeCollection, updateCollection } from '@/redux/reducers/collectionsSlice'
import type { RootState } from '@/redux/store'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Edit a collection the user made: rename it, drag its duas into a new order, remove a dua from it,
 * or delete it. Changes only count after "Save changes". Cancel and the back arrow drop them.
 * Removing a dua here only takes it out of this collection; it stays in the dua library.
 */
export function EditCollectionScreen({ collectionId }: { collectionId: string }) {
  const c = useCollectionEditColors()
  const router = useRouter()
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets()
  const allDuas = useSelector((state: RootState) => state.duas.items)
  const { userCollections } = useCollections()
  const collection = userCollections.find((item) => item.id === collectionId)

  // The draft: what is on screen until it is saved
  const [name, setName] = useState(collection?.name ?? '')
  const [duaIds, setDuaIds] = useState<string[]>(() => {
    const existing = new Set(allDuas.map((dua) => dua.id))
    return (collection?.duaIds ?? []).filter((id) => existing.has(id))
  })
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const leaving = useRef(false)
  const t = useT()

  // Nothing to edit (an unknown id): go back
  useEffect(() => {
    if (!collection && !leaving.current) router.back()
  }, [collection, router])

  const items = useMemo<ReorderableDua[]>(() => {
    const byId = new Map(allDuas.map((dua) => [dua.id, dua]))
    return duaIds.flatMap((id) => {
      const dua = byId.get(id)
      return dua ? [{ id, title: dua.title, subtitle: formatSourceLine(dua) }] : []
    })
  }, [duaIds, allDuas])

  if (!collection) return null

  const canSave = name.trim().length > 0
  const countLabel = t('list.duaCount', { count: items.length })

  const close = () => {
    leaving.current = true
    router.back()
  }

  const save = () => {
    if (!canSave) return
    // A collection cannot exist without a dua: with none left, offer to delete it instead of saving
    if (items.length === 0) {
      Alert.alert(t('editCollection.emptyTitle'), t('editCollection.emptyBody'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('editCollection.delete'), style: 'destructive', onPress: () => setConfirmingDelete(true) },
      ])
      return
    }
    dispatch(updateCollection({ id: collection.id, name: name.trim(), duaIds: items.map((item) => item.id) }))
    close()
  }

  const deleteCollection = () => {
    leaving.current = true
    setConfirmingDelete(false)
    dispatch(removeCollection(collection.id))
    // back to Home: the Collection screen underneath is for the collection that is now gone
    router.dismissTo('/')
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.body }}>
      <ScreenHeader
        title={t('editCollection.title')}
        subtitle={t('editCollection.subtitle', { count: countLabel })}
        bottomPadding={7}
        left={<BackButton onPress={close} color={c.icon} />}
        right={
          <Pressable onPress={close} hitSlop={12} accessibilityRole='button' accessibilityLabel={t('common.cancel')}>
            <Text style={[tw`font-nunito-semibold text-[13px]`, { color: c.cancel }]}>{t('common.cancel')}</Text>
          </Pressable>
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={tw`flex-1`}>
        <View style={tw`px-[16px] pt-[8px]`}>
          <Text style={[tw`font-nunito text-[12px] leading-[16px] mb-[6px]`, { color: c.muted }]}>{t('editCollection.nameLabel')}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            maxLength={MAX_COLLECTION_NAME_LENGTH}
            placeholder={t('editCollection.nameLabel')}
            placeholderTextColor={c.muted}
            returnKeyType='done'
            accessibilityLabel={t('editCollection.nameLabel')}
            style={[
              tw`h-[44px] rounded-[12px] border px-[12px] font-nunito text-[14px]`,
              { backgroundColor: c.row, borderColor: c.inputBorder, color: c.text },
            ]}
          />

          <Text style={[tw`font-nunito-semibold text-[14px] leading-[20px] mt-[16px]`, { color: c.text }]}>
            {t('editCollection.duasCount', { count: items.length })}
          </Text>
          <Text style={[tw`font-nunito text-[11px] leading-[14px] mt-[4px]`, { color: c.muted }]}>
            {t('editCollection.hint')}
          </Text>
        </View>

        <View style={tw`flex-1 mt-[12px]`}>
          <ReorderableDuaList
            duas={items}
            onReorder={setDuaIds}
            onRemove={(id) => setDuaIds((current) => current.filter((duaId) => duaId !== id))}
            emptyMessage={t('editCollection.empty')}
          />
        </View>

        <View style={[tw`px-[16px] pt-[10px]`, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <Text style={[tw`font-nunito text-[11px] leading-[14px] mb-[12px]`, { color: c.muted }]}>
            {t('editCollection.removeNote')}
          </Text>
          <PillButton
            label={t('editCollection.delete')}
            onPress={() => setConfirmingDelete(true)}
            backgroundColor={c.deleteBg}
            borderColor={c.deleteBorder}
            textColor={c.deleteText}
          />
          <PillButton
            label={t('editCollection.save')}
            onPress={save}
            disabled={!canSave}
            backgroundColor={c.saveBg}
            textColor={c.saveText}
            style={tw`mt-[12px]`}
          />
        </View>
      </KeyboardAvoidingView>

      <DeleteCollectionDialog
        visible={confirmingDelete}
        collectionName={collection.name}
        duaCount={collection.duaIds.length}
        onDelete={deleteCollection}
        onKeep={() => setConfirmingDelete(false)}
      />
    </View>
  )
}
