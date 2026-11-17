import type { AvatarConfig } from '@/constants/avatar-config'

/*
 * The shape of every resource in data/. Each one is a table (or collection) on the backend, so when
 * the API exists a screen asks it for the same objects instead of importing the JSON.
 * Dates are ISO 8601 strings in UTC. Ids are UUIDs, except duas and collections, which keep their
 * readable ids ('1', 'dhikr-subhanallah', 'Morning').
 *
 * The Dua type is in redux/reducers/duasSlice.ts and the collection type is in constants/collections.ts.
 */

export type AuthProvider = 'google' | 'facebook'

/** Someone who signed in with Google or Facebook. user.json */
export interface User {
  id: string
  /** What other people type to find this user, e.g. 'BG7K3M' (shown as 'BG-7K3M'). See lib/user-code.ts. */
  userCode: string
  /** Missing when the provider did not give one (Facebook can leave it out). */
  email?: string
  firstName: string
  /** Missing when the provider gave a single name. */
  lastName?: string
  /** The customizable avatar (see constants/avatar-config.ts). */
  avatar: AvatarConfig
  authProvider: AuthProvider
  /** The id Google / Facebook gave this person. */
  providerUserId: string
  createdAt: string
  updatedAt: string
}

/** A dua the user marked as a favorite (user_favorites). Unique on userId + duaId. user_favorites.json */
export interface UserFavorite {
  userId: string
  duaId: string
  createdAt: string
}

/** The groups a friend can be put in, so a dua can be sent to a whole group at once. */
export const FRIEND_GROUPS = ['family', 'friends', 'mosque'] as const
export type FriendGroup = (typeof FRIEND_GROUPS)[number]

/**
 * Someone `userId` has added as a friend (user_friends). It goes one way: Ali adding Sara does not
 * make Ali a friend of Sara. Unique on userId + friendId. The friend's avatar, email and name are
 * read from their User. friends.json
 */
export interface UserFriend {
  userId: string
  friendId: string
  /** A friend can be in several groups, e.g. ['family', 'mosque']. Empty when no group was picked. */
  groups: FriendGroup[]
  createdAt: string
}

export type ShareTarget = 'dua' | 'collection'
/** `pending` until the recipient answers. */
export type ShareStatus = 'pending' | 'accepted' | 'declined'

/**
 * A dua or collection `senderId` sent to `recipientId`. Nothing reaches the recipient's library
 * until they accept: then the app copies it into their library as if they had created it (new
 * id, `origin: 'shared'`, `sharedBy: senderId`) after checking for duplicates. The recipient does
 * not have to be a friend. Sending to a group makes one Share per person. shares.json
 */
export interface Share {
  id: string
  type: ShareTarget
  /** The dua id or collection id that was sent, depending on `type`. */
  targetId: string
  senderId: string
  recipientId: string
  status: ShareStatus
  createdAt: string
  /** When the recipient accepted or declined. Missing while `status` is `pending`. */
  respondedAt?: string
}

/** What data.json holds: the entry point of the data. */
export interface DataManifest {
  version: number
  /** The signed-in user, until real login exists. */
  currentUserId: string
  /** Resource name -> the file in data/ that holds it. */
  resources: Record<'duas' | 'collections' | 'users' | 'userFavorites' | 'friends' | 'shares', string>
}
