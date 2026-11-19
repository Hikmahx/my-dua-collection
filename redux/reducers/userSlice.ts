import { DEFAULT_AVATAR, type AvatarConfig } from '@/constants/avatar-config'
import { currentUserId, data, type User } from '@/data'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/** What a person who is not signed in can still customize on this device. */
export interface GuestProfile {
  firstName: string
  lastName?: string
  avatar: AvatarConfig
}

export interface UserState {
  /** The signed-in user, or null when nobody is signed in. */
  currentUser: User | null
  guest: GuestProfile
}

export interface ProfileChanges {
  firstName: string
  lastName?: string
  /** Only given when the user may change it (the provider did not share one). */
  email?: string
  avatar: AvatarConfig
  /** An ISO date. It comes from the caller so the reducer stays pure. */
  updatedAt: string
}

export const initialUserState: UserState = {
  // Until real login exists, the user named in data.json is signed in
  currentUser: data.users.find((user) => user.id === currentUserId) ?? null,
  guest: { firstName: 'Guest', avatar: DEFAULT_AVATAR },
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    signedIn(state, action: PayloadAction<User>) {
      state.currentUser = action.payload
    },
    signedOut(state) {
      state.currentUser = null
    },
    /** Saves the profile form: to the signed-in user, or to the guest profile on this device. */
    updateProfile(state, action: PayloadAction<ProfileChanges>) {
      const { firstName, lastName, email, avatar, updatedAt } = action.payload
      const user = state.currentUser

      if (!user) {
        state.guest = { firstName, lastName, avatar }
        return
      }
      user.firstName = firstName
      if (lastName) user.lastName = lastName
      else delete user.lastName
      if (email !== undefined) {
        if (email) user.email = email
        else delete user.email
      }
      user.avatar = avatar
      user.updatedAt = updatedAt
    },
    /** A new user code replaces the old one, which stops working. */
    setUserCode(state, action: PayloadAction<{ code: string; updatedAt: string }>) {
      if (!state.currentUser) return
      state.currentUser.userCode = action.payload.code
      state.currentUser.updatedAt = action.payload.updatedAt
    },
    /** Puts the saved state back on launch. */
    hydrateUser(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload)
    },
  },
})

export const { signedIn, signedOut, updateProfile, setUserCode, hydrateUser } = userSlice.actions
export default userSlice.reducer
