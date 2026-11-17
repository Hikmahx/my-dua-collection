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
  email: string
  firstName: string
  lastName: string
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
  /** A friend can be in several groups, e.g. ['family', 'mosque']. */
  groups: FriendGroup[]
  createdAt: string
}

export type ShareTarget = 'dua' | 'collection'
/** `view` = the receiver leaves it as it is. `edit` = the receiver can change it. */
export type SharePermission = 'view' | 'edit'

/**
 * A dua or collection `ownerId` shared with `sharedWithId`. The person does not have to be a friend:
 * the app asks whether to add them as one the first time. Sending to a group makes one Share per
 * person in it. shares.json
 */
export interface Share {
  id: string
  type: ShareTarget
  /** A dua id or a collection id, depending on `type`. */
  targetId: string
  ownerId: string
  sharedWithId: string
  permission: SharePermission
  createdAt: string
}

/** What data.json holds: the entry point of the data. */
export interface DataManifest {
  version: number
  /** The signed-in user, until real login exists. */
  currentUserId: string
  /** Resource name -> the file in data/ that holds it. */
  resources: Record<'duas' | 'collections' | 'users' | 'userFavorites' | 'friends' | 'shares', string>
}
