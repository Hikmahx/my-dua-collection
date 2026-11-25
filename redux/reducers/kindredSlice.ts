import { data, type Share, type UserKindred } from '@/data'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface KindredState {
  /** The user_kindred table: everyone's rows (the screens read the signed-in user's). */
  kindred: UserKindred[]
  /** The shares table. */
  shares: Share[]
}

// Starts as the dummy data in data/. With a backend, the slice is filled from the API instead.
export const initialKindredState: KindredState = {
  kindred: data.kindred,
  shares: data.shares,
}

const kindredSlice = createSlice({
  name: 'kindred',
  initialState: initialKindredState,
  reducers: {
    /** Adds someone as kindred. A person who is already kindred keeps one row; only the groups change. */
    kindredAdded(state, action: PayloadAction<UserKindred>) {
      const { userId, kindredId, groups } = action.payload
      const existing = state.kindred.find((row) => row.userId === userId && row.kindredId === kindredId)
      if (existing) existing.groups = groups
      else state.kindred.push(action.payload)
    },
    sharesSent(state, action: PayloadAction<Share[]>) {
      state.shares.push(...action.payload)
    },
    /** The recipient accepted or declined (see lib/share-rules.ts `respondToShare`). */
    shareUpdated(state, action: PayloadAction<Share>) {
      const index = state.shares.findIndex((share) => share.id === action.payload.id)
      if (index >= 0) state.shares[index] = action.payload
    },
    /** Puts the saved state back on launch. */
    hydrateKindred(state, action: PayloadAction<Partial<KindredState>>) {
      Object.assign(state, action.payload)
    },
  },
})

export const {
  kindredAdded,
  sharesSent,
  shareUpdated,
  hydrateKindred,
} = kindredSlice.actions
export default kindredSlice.reducer
