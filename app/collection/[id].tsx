import { useT } from '@/hooks/use-t'
import { DuaListScreen } from '@/components/dua-list/dua-list-screen'
import { ExportCollectionModal } from '@/components/export/export-collection-modal'
import { useCollections } from '@/hooks/use-collections'
import {
  getDuasInCollection,
  isEditableCollection,
} from '@/lib/collection-utils'
import type { FilterMenuOption, FilterMenuSection } from '@/lib/types'
import type { RootState } from '@/redux/store'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

/** The duas of one collection (opened from a collection card on Home). */
export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const t = useT()
  const allDuas = useSelector((state: RootState) => state.duas.items)
  const { userCollections, getName, find } = useCollections()

  const duas = useMemo(
    () => getDuasInCollection(id, allDuas, userCollections),
    [allDuas, id, userCollections],
  )
  const editable = isEditableCollection(find(id))
  const [exportOpen, setExportOpen] = useState(false)

  // Add opens the "Choose how you'd like to add your dua" sheet Edit is only for collections the user made
  const menuActions: FilterMenuOption[] = editable
    ? [
        {
          id: 'add',
          label: t('collection.addDua'),
          icon: 'plus',
          onSelect: () =>
            router.push({ pathname: '/modal', params: { collection: id } }),
        },
        {
          id: 'edit',
          label: t('collection.edit'),
          icon: 'pencil-outline',
          onSelect: () =>
            router.push({ pathname: '/edit-collection/[id]', params: { id } }),
        },
      ]
    : []

  // Export sits under Appearance and works for every collection, pre-made or the user's own. The dialog opens once
  // the dropdown has finished closing (two native modals cannot overlap on iOS).
  const footerSections: FilterMenuSection[] = [
    {
      id: 'export',
      title: t('export.menuTitle'),
      options: [
        {
          id: 'export-pdf',
          label: t('export.menuPdf'),
          icon: 'file-export-outline',
          onSelect: () => setTimeout(() => setExportOpen(true), 350),
        },
      ],
    },
  ]

  return (
    <>
      <DuaListScreen
        title={getName(id)}
        listId={id}
        duas={duas}
        onBack={() => router.back()}
        emptyMessage={t('collection.empty')}
        menuActions={menuActions}
        footerSections={footerSections}
      />
      <ExportCollectionModal
        visible={exportOpen}
        collectionName={getName(id)}
        duas={duas}
        onClose={() => setExportOpen(false)}
      />
    </>
  )
}
