import { DuaListScreen } from '@/components/dua-list/dua-list-screen'
import { useCollections } from '@/hooks/use-collections'
import {
  getDuasInCollection,
  isEditableCollection,
} from '@/lib/collection-utils'
import type { FilterMenuOption } from '@/lib/types'
import type { RootState } from '@/redux/store'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/** The duas of one collection (opened from a collection card on Home). */
export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const allDuas = useSelector((state: RootState) => state.duas.items)
  const { userCollections, getName, find } = useCollections()

  const duas = useMemo(
    () => getDuasInCollection(id, allDuas, userCollections),
    [allDuas, id, userCollections],
  )
  const editable = isEditableCollection(find(id))

  // Add opens the "Choose how you'd like to add your dua" sheet Edit is only for collections the user made
  const menuActions: FilterMenuOption[] = editable
    ? [
        {
          id: 'add',
          label: 'Add dua',
          icon: 'plus',
          onSelect: () =>
            router.push({ pathname: '/modal', params: { collection: id } }),
        },
        {
          id: 'edit',
          label: 'Edit collection',
          icon: 'pencil-outline',
          onSelect: () =>
            router.push({ pathname: '/edit-collection/[id]', params: { id } }),
        },
      ]
    : []

  return (
    <DuaListScreen
      title={getName(id)}
      listId={id}
      duas={duas}
      onBack={() => router.back()}
      emptyMessage='No duas in this collection yet'
      menuActions={menuActions}
    />
  )
}
