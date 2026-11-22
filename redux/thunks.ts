import { COLLECTION_DEFS } from '@/constants/collections'
import { setDuaCollections } from '@/redux/reducers/collectionsSlice'
import {
  addDuasToCollections,
  addDuaWithCollections,
  type Dua,
  type NewCollectionDraft,
} from '@/redux/reducers/duasSlice'
import type { AppDispatch, RootState } from '@/redux/store'

type AppThunk<Result> = (dispatch: AppDispatch, getState: () => RootState) => Result

/** True when the dua is in one of the pre-made collections, so it needs none of the user's. */
export const isInPremadeCollection = (dua: Pick<Dua, 'collection'>) =>
  dua.collection.some((id) => COLLECTION_DEFS.some((collection) => collection.id === id))

/** The chosen ids that are collections the user really has. Anything else (a pre-made id) is dropped. */
const ownCollectionIds = (state: RootState, ids: string[]) =>
  ids.filter((id) => state.collections.items.some((collection) => collection.id === id))

/**
 * Adds a new dua the user made. It must go into at least one of the user's collections (existing
 * or new); otherwise nothing is saved and this returns false. The dua and its new collections are
 * saved in one step, so nothing is left half-made.
 */
export const createDuaInCollections =
  (dua: Dua, collectionIds: string[], newCollections: NewCollectionDraft[]): AppThunk<boolean> =>
  (dispatch, getState) => {
    const existing = ownCollectionIds(getState(), collectionIds)
    if (existing.length + newCollections.length === 0) return false
    dispatch(addDuaWithCollections({ dua, collectionIds: existing, newCollections }))
    return true
  }

/**
 * Sets which of the user's collections a dua is in (the "Save to collection" sheet). A dua the
 * user added has to stay in at least one; a built-in dua can leave them all because it is in a
 * pre-made collection. Returns false (and changes nothing) when that rule would be broken.
 */
export const saveDuaCollections =
  (dua: Dua, collectionIds: string[], newCollections: NewCollectionDraft[]): AppThunk<boolean> =>
  (dispatch, getState) => {
    const existing = ownCollectionIds(getState(), collectionIds)
    if (existing.length + newCollections.length === 0 && !isInPremadeCollection(dua)) return false
    dispatch(setDuaCollections({ duaId: dua.id, collectionIds: existing, newCollections }))
    return true
  }

/**
 * Adds duas that already exist (pre-made or the user's own) to the user's collections, existing or
 * new (a new collection is created with these duas). Ids that are not a real dua are dropped.
 * Returns false (and changes nothing) when no dua or no collection is left.
 */
export const saveExistingDuasToCollections =
  (duaIds: string[], collectionIds: string[], newCollections: NewCollectionDraft[]): AppThunk<boolean> =>
  (dispatch, getState) => {
    const state = getState()
    const duas = duaIds.filter((id) => state.duas.items.some((dua) => dua.id === id))
    const existing = ownCollectionIds(state, collectionIds)
    if (duas.length === 0 || existing.length + newCollections.length === 0) return false
    dispatch(addDuasToCollections({ duaIds: duas, collectionIds: existing, newCollections }))
    return true
  }
