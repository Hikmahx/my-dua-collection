import { DuaListScreen } from '@/components/dua-list/dua-list-screen'
import type { RootState } from '@/redux/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/** Every favorited dua, with the collections each one belongs to. */
export default function FavoritesScreen() {
  const allDuas = useSelector((state: RootState) => state.duas.items)
  const favorites = useMemo(() => allDuas.filter((dua) => dua.isFavorite), [allDuas])

  return (
    <DuaListScreen
      title='Favorites'
      duas={favorites}
      showCollections
      emptyMessage='No favorite duas yet'
    />
  )
}
