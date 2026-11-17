import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { data } from '@/data'

export type DuaSource = 'quran' | 'hadith'
export type DuaOrigin = 'builtin' | 'manual' | 'ai' | 'image' | 'shared'

export interface Dua {
  id: string
  title: string
  arabicText: string
  transliteration?: string
  translations: Record<string, string> // keyed by language code
  categories: string[]
  source?: DuaSource
  reference?: string // '21:87' or '11:39-42'
  info?: string // HTML from the rich editor
  repeat?: number // how many times the dua is recited; the Dua screen's counter counts down from it
  audioUrl?: string // recording played by the Dua screen's audio button
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

interface DuasState {
  items: Dua[]
}

const initialState: DuasState = {
  items: BUILT_IN_DUAS,
}

const duasSlice = createSlice({
  name: 'duas',
  initialState,
  reducers: {
    setDuas(state, action: PayloadAction<Dua[]>) {
      state.items = action.payload
    },
    addDua(state, action: PayloadAction<Dua>) {
      state.items.push(action.payload)
    },
    removeDua(state, action: PayloadAction<string>) {
      state.items = state.items.filter((dua) => dua.id !== action.payload)
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const dua = state.items.find((d) => d.id === action.payload)
      if (dua) dua.isFavorite = !dua.isFavorite
    },
    updateDua(state, action: PayloadAction<Dua>) {
      const index = state.items.findIndex((d) => d.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
  },
})

export const { setDuas, addDua, removeDua, toggleFavorite, updateDua } =
  duasSlice.actions
export default duasSlice.reducer
