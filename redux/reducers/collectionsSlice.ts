import { NEW_COLLECTION_ICON_KEY, type UserCollection } from '@/constants/collections'
import {
  addDuaWithCollections,
  removeDua,
  type NewCollectionDraft,
} from '@/redux/reducers/duasSlice'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CollectionsState {
  /** Only the collections the user made. The pre-made ones come from data/collection.json. */
  items: UserCollection[]
}

const initialState: CollectionsState = { items: [] }

/**
 * Makes `duaId` belong to exactly `collectionIds` among the user's collections (plus the new ones,
 * which are created with this dua as their first). A collection that loses its last dua is
 * deleted: a collection cannot exist without a dua. Ids that match no collection are ignored.
 */
function applyDuaMembership(
  state: CollectionsState,
  duaId: string,
  collectionIds: string[],
  newCollections: NewCollectionDraft[],
  /** true: collections not in `collectionIds` lose the dua. false: they are left as they are. */
  removeFromOthers: boolean,
) {
  for (const collection of state.items) {
    const wanted = collectionIds.includes(collection.id)
    const has = collection.duaIds.includes(duaId)
    if (wanted && !has) collection.duaIds.push(duaId)
    if (!wanted && has && removeFromOthers) {
      collection.duaIds = collection.duaIds.filter((id) => id !== duaId)
    }
  }
  for (const { id, name } of newCollections) {
    if (state.items.some((collection) => collection.id === id)) continue
    state.items.push({
      id,
      name: name.trim(),
      iconKey: NEW_COLLECTION_ICON_KEY,
      isUserCreated: true,
      duaIds: [duaId],
    })
  }
  state.items = state.items.filter((collection) => collection.duaIds.length > 0)
}

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollections(state, action: PayloadAction<UserCollection[]>) {
      state.items = action.payload
    },
    /**
     * Saves the Edit collection screen: the new name and the duas that are left, in order. A
     * collection left with no duas is deleted (it cannot exist without one).
     */
    updateCollection(state, action: PayloadAction<{ id: string; name: string; duaIds: string[] }>) {
      const collection = state.items.find((c) => c.id === action.payload.id)
      if (!collection) return
      if (action.payload.duaIds.length === 0) {
        state.items = state.items.filter((c) => c.id !== action.payload.id)
        return
      }
      collection.name = action.payload.name
      collection.duaIds = action.payload.duaIds
    },
    /**
     * The "Save to collection" sheet: puts the dua in exactly these collections of the user's
     * (taking it out of the others) and creates the new ones with this dua as their first. Use the
     * `saveDuaCollections` thunk, which makes sure a dua the user added is left in at least one.
     */
    setDuaCollections(
      state,
      action: PayloadAction<{
        duaId: string
        /** Ids of the collections that exist already and should hold the dua. */
        collectionIds: string[]
        newCollections?: NewCollectionDraft[]
      }>,
    ) {
      const { duaId, collectionIds, newCollections = [] } = action.payload
      applyDuaMembership(state, duaId, collectionIds, newCollections, true)
    },
    /** Deletes the collection and its order. The duas themselves stay in the library. */
    removeCollection(state, action: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    // A new dua and the collections it goes into are saved in one step, so a collection is only ever
    // created together with its first dua (a cancelled or failed add creates nothing)
    builder.addCase(addDuaWithCollections, (state, action) => {
      const { dua, collectionIds, newCollections } = action.payload
      applyDuaMembership(state, dua.id, collectionIds, newCollections, false)
    })
    // A dua deleted from the library leaves every collection. A collection that only had this dua
    // goes with it, because a collection cannot exist without a dua
    builder.addCase(removeDua, (state, action) => {
      for (const collection of state.items) {
        collection.duaIds = collection.duaIds.filter((id) => id !== action.payload)
      }
      state.items = state.items.filter((collection) => collection.duaIds.length > 0)
    })
  },
})

export const { setCollections, updateCollection, setDuaCollections, removeCollection } =
  collectionsSlice.actions
export default collectionsSlice.reducer
