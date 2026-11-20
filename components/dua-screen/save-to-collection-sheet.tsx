import { CollectionIcon } from '@/components/icons/collection-icons'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { PillButton } from '@/components/ui/pill-button'
import { NEW_COLLECTION_ICON_KEY } from '@/constants/collections'
import { useCollections } from '@/hooks/use-collections'
import { useNewCollectionInput } from '@/hooks/use-new-collection-input'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useT } from '@/hooks/use-t'
import { createCollectionId } from '@/lib/collection-utils'
import tw from '@/lib/tailwind'
import type { Dua, NewCollectionDraft } from '@/redux/reducers/duasSlice'
import type { AppDispatch } from '@/redux/store'
import { saveDuaCollections } from '@/redux/thunks'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useDispatch } from 'react-redux'

interface SaveToCollectionSheetProps {
  /** The dua on screen: the one that is saved. */
  dua: Dua
  visible: boolean
  onClose: () => void
}

/**
 * "Save to collection" (opened with the + in the Dua screen's bottom bar), in the style of TikTok's
 * collections sheet: every collection the user made with a tick, and "New collection" at the top.
 * Only the user's own collections are listed: the pre-made ones are read only.
 *
 * Ticks are a draft. Nothing changes until "Done"; closing the sheet any other way drops it. A new
 * collection made here is only created when the sheet is saved, together with this dua, so it
 * never exists empty. If unticking would leave a collection with no duas, the collection is deleted
 * (after asking), because a collection cannot exist without a dua.
 */
export function SaveToCollectionSheet({ dua, visible, onClose }: SaveToCollectionSheetProps) {
  const t = useT()
  const c = useSettingsColors()
  const dispatch = useDispatch<AppDispatch>()
  const { userCollections } = useCollections()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [drafts, setDrafts] = useState<NewCollectionDraft[]>([])

  // Start from what is saved each time the sheet opens (or the dua changes)
  useEffect(() => {
    if (!visible) return
    setSelectedIds(userCollections.filter((collection) => collection.duaIds.includes(dua.id)).map((collection) => collection.id))
    setDrafts([])
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the sheet opens, not on every collection change
  }, [visible, dua.id])

  const newCollection = useNewCollectionInput(
    (name) => {
      const created = { id: createCollectionId(), name }
      setDrafts((current) => [...current, created])
      setSelectedIds((current) => [...current, created.id])
    },
    drafts.map((draft) => draft.name),
  )

  // Leaving the sheet forgets a half-typed name
  const close = useCallback(() => {
    newCollection.close()
    onClose()
  }, [newCollection, onClose])

  const toggle = (id: string) =>
    setSelectedIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))

  const save = () => {
    let chosen = selectedIds
    let created = drafts
    // A name typed but not confirmed with the tick still counts
    if (newCollection.creating && newCollection.name.trim()) {
      const typed = newCollection.check()
      if (!typed) return
      const extra = { id: createCollectionId(), name: typed }
      created = [...created, extra]
      chosen = [...chosen, extra.id]
    }

    const newCollections = created.filter((draft) => chosen.includes(draft.id))
    const existingIds = chosen.filter((id) => !newCollections.some((draft) => draft.id === id))

    // Collections that hold only this dua and were unticked would be left empty, so they go
    const emptied = userCollections.filter(
      (collection) =>
        !existingIds.includes(collection.id) && collection.duaIds.length === 1 && collection.duaIds[0] === dua.id,
    )

    const apply = () => {
      const saved = dispatch(saveDuaCollections(dua, existingIds, newCollections))
      if (!saved) {
        Alert.alert(t('saveToCollection.needOneTitle'), t('saveToCollection.needOneBody'))
        return
      }
      close()
    }

    if (emptied.length === 0) return apply()
    Alert.alert(
      t('saveToCollection.deleteEmptyTitle'),
      t('saveToCollection.deleteEmptyBody', { names: emptied.map((collection) => `"${collection.name}"`).join(', ') }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('saveToCollection.deleteEmptyConfirm'), style: 'destructive', onPress: apply },
      ],
    )
  }

  const rows = [
    ...userCollections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      iconKey: collection.iconKey,
      subtitle: t('collection.duaCount', { count: collection.duaIds.length }),
    })),
    ...drafts.map((draft) => ({
      id: draft.id,
      name: draft.name,
      iconKey: NEW_COLLECTION_ICON_KEY,
      subtitle: t('saveToCollection.newNote'),
    })),
  ]

  return (
    <BottomSheet visible={visible} onClose={close} backgroundColor={c.body} handleColor={c.muted}>
      <Text style={[tw`font-nunito-extrabold text-[16px] px-6 pt-2`, { color: c.title }]}>{t('saveToCollection.title')}</Text>
      <Text numberOfLines={1} style={[tw`font-nunito text-[12px] px-6 mt-[3px]`, { color: c.muted }]}>
        {dua.title}
      </Text>

      <ScrollView
        style={tw`mt-3`}
        contentContainerStyle={tw`px-4 pb-2`}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        {/* New collection: first row, like TikTok. It turns into an input when tapped */}
        {newCollection.creating ? (
          <View style={tw`mb-3`}>
            <View style={tw`flex-row items-center`}>
              <TextInput
                autoFocus
                value={newCollection.name}
                onChangeText={newCollection.changeName}
                maxLength={newCollection.maxLength}
                placeholder={t('newCollection.placeholder')}
                placeholderTextColor={c.muted}
                returnKeyType='done'
                onSubmitEditing={newCollection.submit}
                accessibilityLabel={t('newCollection.placeholder')}
                style={[
                  tw`flex-1 h-[48px] rounded-[12px] border px-[12px] font-nunito text-[14px]`,
                  { backgroundColor: c.field, borderColor: c.fieldBorder, color: c.title },
                ]}
              />
              <Pressable onPress={newCollection.submit} hitSlop={8} accessibilityRole='button' accessibilityLabel={t('newCollection.create')} style={tw`ml-[10px]`}>
                <MaterialCommunityIcons name='check-circle' size={28} color={c.accent} />
              </Pressable>
              <Pressable onPress={newCollection.close} hitSlop={8} accessibilityRole='button' accessibilityLabel={t('newCollection.cancel')} style={tw`ml-[8px]`}>
                <MaterialCommunityIcons name='close-circle-outline' size={28} color={c.muted} />
              </Pressable>
            </View>
            {!!newCollection.error && (
              <Text style={[tw`font-nunito text-[11px] mt-[6px]`, { color: c.danger }]}>{newCollection.error}</Text>
            )}
          </View>
        ) : (
          <Pressable
            onPress={newCollection.open}
            accessibilityRole='button'
            accessibilityLabel={t('saveToCollection.newCollection')}
            style={({ pressed }) => [tw`flex-row items-center rounded-xl px-3 py-[10px] mb-2`, { backgroundColor: c.card, opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[tw`w-[44px] h-[44px] rounded-[10px] items-center justify-center mr-3`, { backgroundColor: c.previewBg }]}>
              <MaterialCommunityIcons name='plus' size={24} color={c.accent} />
            </View>
            <Text style={[tw`flex-1 font-nunito-semibold text-[14px]`, { color: c.accent }]}>
              {t('saveToCollection.newCollection')}
            </Text>
          </Pressable>
        )}

        {rows.length === 0 && !newCollection.creating && (
          <Text style={[tw`font-nunito text-[12px] text-center py-4 px-4`, { color: c.muted }]}>{t('saveToCollection.empty')}</Text>
        )}

        {rows.map((row) => {
          const selected = selectedIds.includes(row.id)
          return (
            <Pressable
              key={row.id}
              onPress={() => toggle(row.id)}
              accessibilityRole='checkbox'
              accessibilityState={{ checked: selected }}
              accessibilityLabel={row.name}
              style={({ pressed }) => [
                tw`flex-row items-center rounded-xl px-3 py-[10px] mb-2`,
                {
                  backgroundColor: selected ? c.previewBg : c.card,
                  borderWidth: 1,
                  borderColor: selected ? c.accent : 'transparent',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={[tw`w-[44px] h-[44px] rounded-[10px] items-center justify-center mr-3`, { backgroundColor: c.previewBg }]}>
                <CollectionIcon name={row.iconKey} color={c.accent} size={22} />
              </View>
              <View style={tw`flex-1 pr-3`}>
                <Text numberOfLines={1} style={[tw`font-nunito-semibold text-[14px]`, { color: c.title }]}>
                  {row.name}
                </Text>
                <Text style={[tw`font-nunito text-[11px] mt-[2px]`, { color: c.muted }]}>{row.subtitle}</Text>
              </View>
              <MaterialCommunityIcons
                name={selected ? 'check-circle' : 'circle-outline'}
                size={24}
                color={selected ? c.accent : c.muted}
              />
            </Pressable>
          )
        })}
      </ScrollView>

      <View style={tw`px-4 pt-2`}>
        <PillButton label={t('saveToCollection.done')} onPress={save} backgroundColor={c.accent} textColor={c.body} />
      </View>
    </BottomSheet>
  )
}
