import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import duasData from '@/data/data.json'

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
  origin: DuaOrigin
  isFavorite: boolean
  iconPath?: string // Path to the icon SVG
}

interface DuasState {
  items: Dua[]
}

const initialState: DuasState = {
  items: duasData as Dua[],
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
