import { DEFAULT_TARGET } from '@/constants/tasbih-config'
import { DEFAULT_DHIKR_ID } from '@/constants/tasbih-presets'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TasbihState {
  dhikrId: string // 'preset:…' or 'dua:<id>'
  count: number
  target: number
  soundEnabled: boolean
  vibrationEnabled: boolean
}

export const initialTasbihState: TasbihState = {
  dhikrId: DEFAULT_DHIKR_ID,
  count: 0,
  target: DEFAULT_TARGET,
  soundEnabled: true,
  vibrationEnabled: true,
}

const tasbihSlice = createSlice({
  name: 'tasbih',
  initialState: initialTasbihState,
  reducers: {
    hydrateTasbih(state, action: PayloadAction<TasbihState>) {
      return action.payload
    },
    increment(state) {
      state.count += 1
    },
    resetCount(state) {
      state.count = 0
    },
    /** A new target always starts a fresh round. */
    setTarget(state, action: PayloadAction<number>) {
      state.target = action.payload
      state.count = 0
    },
    /** Changing the dua resets the counter; picking the current one changes nothing. */
    selectDhikr(state, action: PayloadAction<string>) {
      if (state.dhikrId === action.payload) return
      state.dhikrId = action.payload
      state.count = 0
    },
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled
    },
    toggleVibration(state) {
      state.vibrationEnabled = !state.vibrationEnabled
    },
  },
})

export const {
  hydrateTasbih,
  increment,
  resetCount,
  setTarget,
  selectDhikr,
  toggleSound,
  toggleVibration,
} = tasbihSlice.actions
export default tasbihSlice.reducer
