import type { NewCollectionDraft } from '@/redux/reducers/duasSlice'
import { useCollections } from '@/hooks/use-collections'
import { useNewCollectionInput } from '@/hooks/use-new-collection-input'
import { createCollectionId } from '@/lib/collection-utils'
import { useCallback, useState } from 'react'

/** The collections an add-dua form will save into. */
export interface ChosenCollections {
  /** Ids of the user's collections that exist already. */
  existingIds: string[]
  /** Collections made with "+" and still chosen. They are only created when the dua(s) are saved. */
  newCollections: NewCollectionDraft[]
  /** Nothing is chosen: the form has to ask for a collection. */
  isEmpty: boolean
}

/**
 * Which of the user's collections are chosen in the add-dua form, shared by the "New" and the
 * "Existing" forms: the ticked ones, the new ones typed with the "+" pill (they only exist in the
 * form until the save), and the "+" input itself. `initialId` is a collection to start with (the
 * one the form was opened from). `resolve` gives what to save, see below.
 */
export function useCollectionChoice(initialId?: string) {
  // Only the collections the user made can be chosen: the pre-made ones are read only
  const { userCollections } = useCollections()
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    initialId && userCollections.some((collection) => collection.id === initialId) ? [initialId] : [],
  )
  const [pendingCollections, setPendingCollections] = useState<NewCollectionDraft[]>([])

  const toggle = useCallback((id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
  }, [])

  // The name typed after "+": the collection is chosen right away, but only made when the form is saved
  const newCollection = useNewCollectionInput(
    (name) => {
      const created = { id: createCollectionId(), name }
      setPendingCollections((current) => [...current, created])
      setSelectedIds((current) => [...current, created.id])
    },
    pendingCollections.map((collection) => collection.name),
  )

  /**
   * What to save into. A name typed after "+" but not confirmed with the tick yet still counts: it
   * is checked now and made together with the dua(s). Returns null (the wrong name is shown under
   * the field) when that name is not valid, and nothing should be saved.
   */
  const resolve = useCallback((): ChosenCollections | null => {
    let chosenIds = selectedIds
    let drafts = pendingCollections
    if (newCollection.creating && newCollection.name.trim()) {
      const typed = newCollection.check()
      if (!typed) return null
      const created = { id: createCollectionId(), name: typed }
      drafts = [...drafts, created]
      chosenIds = [...chosenIds, created.id]
    }

    // The collections made with "+" and unchosen again are dropped
    const newCollections = drafts.filter((draft) => chosenIds.includes(draft.id))
    const existingIds = chosenIds.filter((id) => !newCollections.some((draft) => draft.id === id))
    return { existingIds, newCollections, isEmpty: chosenIds.length === 0 }
  }, [selectedIds, pendingCollections, newCollection])

  return { userCollections, selectedIds, pendingCollections, toggle, newCollection, resolve }
}

export type CollectionChoice = ReturnType<typeof useCollectionChoice>
