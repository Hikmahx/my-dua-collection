/**
 * The entry point of the data. data.json lists the resources and which file holds each one (and who
 * is signed in until real login exists); this file loads them. Metro needs every JSON import to be
 * written out, so a new resource is added in both places.
 *
 * Today everything is read from the JSON files. When the backend is ready, only this file changes:
 * it fetches the same objects from the API instead.
 */
import type { DuaContent } from '@/redux/reducers/duasSlice'
import type { CollectionDef } from '@/constants/collections'
import type { DataManifest, ExploreArticle, Share, User, UserFavorite, UserFriend } from './types'

import manifest from './data.json'
import collections from './collection.json'
import duas from './dua.json'
import exploreArticles from './explore_articles.json'
import friends from './friends.json'
import namesOfAllah from './names_of_allah.json'
import shares from './shares.json'
import userFavorites from './user_favorites.json'
import users from './user.json'

export * from './types'

export const dataManifest = manifest as DataManifest

/** The signed-in user's id. */
export const currentUserId = dataManifest.currentUserId

export const data = {
  duas: duas as DuaContent[],
  collections: collections as CollectionDef[],
  users: users as User[],
  userFavorites: userFavorites as UserFavorite[],
  friends: friends as UserFriend[],
  shares: shares as Share[],
  exploreArticles: exploreArticles as ExploreArticle[],
  namesOfAllah: namesOfAllah as ExploreArticle[],
}
