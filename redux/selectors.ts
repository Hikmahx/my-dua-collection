import { getFavoriteDuas } from '@/lib/favorites'
import type { RootState } from '@/redux/store'
import { createSelector } from '@reduxjs/toolkit'

/** The favorite duas in the order the user arranged them. */
export const selectFavoriteDuas = createSelector(
  [(state: RootState) => state.duas.items, (state: RootState) => state.duas.favoriteOrder],
  getFavoriteDuas,
)
