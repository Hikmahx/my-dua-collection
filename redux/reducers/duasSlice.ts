import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Dua {
  id: string
  title: string
  arabicText: string
  englishTranslation: string
  category: string
  isFavorite: boolean
  isUserCreated?: boolean
  iconPath?: string // Path to the icon SVG
  verseReference?: string // For Quranic duas (e.g., 'Quran 21:87')
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
      iconPath: '@/assets/icons/duas/book.svg',
      verseReference: 'Quran 21:87',
    },
    {
      id: '2',
      title: 'Morning Dua',
      arabicText: 'أصبحنا على فطرة الله',
      englishTranslation:
        'We have reached the morning upon the fitrah of Allah',
      category: 'Morning',
      isFavorite: false,
      iconPath: '@/assets/icons/duas/sun.svg',
    },
    {
      id: '3',
      title: 'Tahjjud Dua',
      arabicText: 'الحمد لله حمدا كثيرا',
      englishTranslation: 'All praise be to Allah, a praise that is abundant',
      category: 'Night',
      isFavorite: false,
      iconPath: '@/assets/icons/duas/lamp.svg',
    },
    {
      id: '4',
      title: 'The Power of Prayer',
      arabicText: 'يا مجيب الدعاء',
      englishTranslation: 'O Answerer of Supplications',
      category: 'General',
      isFavorite: false,
      isUserCreated: true,
      iconPath: '@/assets/icons/duas/journal.svg',
    },
    {
      id: '5',
      title: 'After Prayer',
      arabicText: 'اللهم أنت السلام',
      englishTranslation: 'O Allah, You are As-Salam (The Source of Peace)',
      category: 'Prayer',
      isFavorite: false,
      iconPath: '@/assets/icons/duas/hands.svg',
    },
    {
      id: '6',
      title: 'Evening Dua',
      arabicText: 'أمسينا على فطرة الله',
      englishTranslation:
        'We have reached the evening upon the fitrah of Allah',
      category: 'Evening',
      isFavorite: false,
      iconPath: '@/assets/icons/duas/moon.svg',
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
