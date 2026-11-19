import { DuaListScreen } from '@/components/dua-list/dua-list-screen'
import { FAVORITES_LIST_ID } from '@/constants/dua-config'
import { selectFavoriteDuas } from '@/redux/selectors'
import { setFavoriteOrder } from '@/redux/reducers/duasSlice'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Every favorited dua, in the order the user arranged them (Reorder in the menu), with the
 * collections each one belongs to. The Dua screen goes through them in this same order.
 */
export default function FavoritesScreen() {
  const dispatch = useDispatch()
  const favorites = useSelector(selectFavoriteDuas)

  return (
    <DuaListScreen
      title='Favorites'
      listId={FAVORITES_LIST_ID}
      duas={favorites}
      showCollections
      emptyMessage='No favorite duas yet'
      onReorder={(ids) => dispatch(setFavoriteOrder(ids))}
    />
  )
}
