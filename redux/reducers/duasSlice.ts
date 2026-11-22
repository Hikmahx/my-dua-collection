import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { data } from '@/data'
import { normalizeFavoriteOrder } from '@/lib/favorites'

export type DuaSource = 'quran' | 'hadith'
export type DuaOrigin = 'builtin' | 'manual' | 'ai' | 'image' | 'shared'

export interface Dua {
  id: string
  title: string
  arabicText: string
  transliteration?: string
  translations: Record<string, string> // keyed by language code
  collection: string[] // ids of the pre-made collections the dua is in
  source?: DuaSource
  reference?: string // '21:87' or '11:39-42'
  info?: string // HTML from the rich editor
  repeat?: number // how many times the dua is recited; the Dua screen's counter counts down from it
  // audioUrl?: string // reserved for audio recitations (nothing plays it yet)
  origin: DuaOrigin
  /** Id of the user who shared this dua. Missing (or null) when the user made it themselves. Shared copies also have `origin: 'shared'`. */
  sharedBy?: string | null
  isFavorite: boolean
  iconPath?: string // Path to the icon SVG
}

/** A dua without the user's own state. This is what dua.json holds and what is saved for added duas. */
export type DuaContent = Omit<Dua, 'isFavorite'>

/** The duas that ship with the app, read from data/dua.json (through `data`). Nothing is a favorite until the user says so. */
export const BUILT_IN_DUAS: Dua[] = data.duas.map((dua) => ({ ...dua, isFavorite: false }))

const BUILT_IN_IDS = new Set(BUILT_IN_DUAS.map((dua) => dua.id))

/**
 * True for a dua that ships with the app (an id in dua.json). Pre-made duas are read only: they
 * can be favorited and put in the user's collections, but never edited or deleted. `updateDua` and
 * `removeDua` (here and in the collections slice) ignore them, whatever screen sends the action.
 */
export const isBuiltInDuaId = (id: string) => BUILT_IN_IDS.has(id)

interface DuasState {
  items: Dua[]
  /** Ids of the favorite duas in the order the user arranged them (Favorites lists them this way). */
  favoriteOrder: string[]
}

/** A collection the user is making together with a dua: it only exists once the dua is saved. */
export interface NewCollectionDraft {
  id: string
  name: string
}

/**
 * Saves a new dua together with the collections it goes into (existing ones by id, and new ones to
 * create). Both slices handle this one action, so it is all-or-nothing: no dua without a
 * collection, and no collection without its dua. Use the `createDuaInCollections` thunk, which
 * checks the dua is going into at least one collection before it dispatches this.
 */
export const addDuaWithCollections = createAction<{
  dua: Dua
  collectionIds: string[]
  newCollections: NewCollectionDraft[]
}>('duas/addDuaWithCollections')

/**
 * Puts duas that already exist (pre-made or the user's own) into collections of the user's: the
 * ones they have, and new ones that are created with these duas. Only the collections slice
 * handles it, since the duas themselves do not change. Use the `saveExistingDuasToCollections` thunk.
 */
export const addDuasToCollections = createAction<{
  duaIds: string[]
  collectionIds: string[]
  newCollections: NewCollectionDraft[]
}>('duas/addDuasToCollections')

const initialState: DuasState = {
  items: BUILT_IN_DUAS,
  favoriteOrder: [],
}

/** Keeps `favoriteOrder` matching the favorites: a new favorite goes last, an unfavorited or deleted dua leaves. */
const syncFavoriteOrder = (state: DuasState) => {
  state.favoriteOrder = normalizeFavoriteOrder(state.items, state.favoriteOrder)
}

const duasSlice = createSlice({
  name: 'duas',
  initialState,
  reducers: {
    setDuas(state, action: PayloadAction<Dua[]>) {
      state.items = action.payload
      syncFavoriteOrder(state)
    },
    addDua(state, action: PayloadAction<Dua>) {
      state.items.push(action.payload)
      syncFavoriteOrder(state)
    },
    /** Deletes a dua the user added. Pre-made duas are read only, so this ignores them. */
    removeDua(state, action: PayloadAction<string>) {
      if (isBuiltInDuaId(action.payload)) return
      state.items = state.items.filter((dua) => dua.id !== action.payload)
      syncFavoriteOrder(state)
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const dua = state.items.find((d) => d.id === action.payload)
      if (dua) dua.isFavorite = !dua.isFavorite
      syncFavoriteOrder(state)
    },
    /** Replaces a dua the user added. Pre-made duas are read only, so this ignores them. */
    updateDua(state, action: PayloadAction<Dua>) {
      if (isBuiltInDuaId(action.payload.id)) return
      const index = state.items.findIndex((d) => d.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
      syncFavoriteOrder(state)
    },
    /** The user arranged their favorites: `ids` is the new order (anything that is not a favorite is ignored). */
    setFavoriteOrder(state, action: PayloadAction<string[]>) {
      state.favoriteOrder = action.payload
      syncFavoriteOrder(state)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addDuaWithCollections, (state, action) => {
      state.items.push(action.payload.dua)
      syncFavoriteOrder(state)
    })
  },
})

export const { setDuas, addDua, removeDua, toggleFavorite, updateDua, setFavoriteOrder } =
  duasSlice.actions
export default duasSlice.reducer
