import type { UserCollection } from '@/constants/collections'
import { removeDua } from '@/redux/reducers/duasSlice'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CollectionsState {
  /** Only the collections the user made. The pre-made ones come from data/collection.json. */
  items: UserCollection[]
}

const initialState: CollectionsState = { items: [] }

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollections(state, action: PayloadAction<UserCollection[]>) {
      state.items = action.payload
    },
    addCollection(state, action: PayloadAction<UserCollection>) {
      state.items.push(action.payload)
    },
    /** Saves the Edit collection screen: the new name and the duas that are left, in order. */
    updateCollection(state, action: PayloadAction<{ id: string; name: string; duaIds: string[] }>) {
      const collection = state.items.find((c) => c.id === action.payload.id)
      if (!collection) return
      collection.name = action.payload.name
      collection.duaIds = action.payload.duaIds
    },
    addDuaToCollection(state, action: PayloadAction<{ collectionId: string; duaId: string }>) {
      const collection = state.items.find((c) => c.id === action.payload.collectionId)
      if (collection && !collection.duaIds.includes(action.payload.duaId)) {
        collection.duaIds.push(action.payload.duaId)
      }
    },
    /** Deletes the collection and its order. The duas themselves stay in the library. */
    removeCollection(state, action: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    // a dua deleted from the library leaves every collection
    builder.addCase(removeDua, (state, action) => {
      for (const collection of state.items) {
        collection.duaIds = collection.duaIds.filter((id) => id !== action.payload)
      }
    })
  },
})

export const { setCollections, addCollection, updateCollection, addDuaToCollection, removeCollection } =
  collectionsSlice.actions
export default collectionsSlice.reducer
