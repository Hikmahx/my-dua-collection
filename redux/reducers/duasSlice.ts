import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Dua {
  id: string
  title: string
  arabicText: string
  englishTranslation: string
  category: string
  isFavorite: boolean
  isUserCreated?: boolean
}

interface DuasState {
  items: Dua[]
  favorites: string[] // Array of dua IDs
}

const initialState: DuasState = {
  items: [
    {
      id: '1',
      title: 'Quranic Dua',
      arabicText:
        'فَإِن شَكَّ‌تُم أَن شَكَّ‌تُم إِنَّهُ لَا إِلَـٰهَ إِلَّا أَنتَ الظَّالِمِين',
      englishTranslation:
        'There is no deity but You. Indeed, I have been of the wrongdoers.',
      category: 'Quranic',
      isFavorite: false,
    },
    {
      id: '2',
      title: 'Morning Dua',
      arabicText: 'أصبحنا على فطرة الله',
      englishTranslation:
        'We have reached the morning upon the fitrah of Allah',
      category: 'Morning',
      isFavorite: false,
    },
    {
      id: '3',
      title: 'Tahjjud Dua',
      arabicText: 'الحمد لله حمدا كثيرا',
      englishTranslation: 'All praise be to Allah, a praise that is abundant',
      category: 'Night',
      isFavorite: false,
    },
    {
      id: '4',
      title: 'The Power of Prayer',
      arabicText: 'يا مجيب الدعاء',
      englishTranslation: 'O Answerer of Supplications',
      category: 'General',
      isFavorite: false,
    },
    {
      id: '5',
      title: 'After Prayer',
      arabicText: 'اللهم أنت السلام',
      englishTranslation: 'O Allah, You are As-Salam (The Source of Peace)',
      category: 'Prayer',
      isFavorite: false,
    },
  ],
  favorites: [],
}

const duasSlice = createSlice({
  name: 'duas',
  initialState,
  reducers: {
    addDua(state, action: PayloadAction<Dua>) {
      state.items.push(action.payload)
    },
    removeDua(state, action: PayloadAction<string>) {
      state.items = state.items.filter((dua) => dua.id !== action.payload)
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const dua = state.items.find((d) => d.id === action.payload)
      if (dua) {
        dua.isFavorite = !dua.isFavorite
        if (dua.isFavorite) {
          state.favorites.push(action.payload)
        } else {
          state.favorites = state.favorites.filter(
            (id) => id !== action.payload,
          )
        }
      }
    },
    updateDua(state, action: PayloadAction<Dua>) {
      const index = state.items.findIndex((d) => d.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
  },
})

export const { addDua, removeDua, toggleFavorite, updateDua } =
  duasSlice.actions
export default duasSlice.reducer
