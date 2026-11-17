import { DuaScreen } from '@/components/dua-screen/dua-screen'
import { FAVORITES_LIST_ID } from '@/constants/dua-config'
import { getCollectionName } from '@/constants/collections'
import { getListDuas } from '@/lib/dua-utils'
import type { Dua } from '@/redux/reducers/duasSlice'
import type { RootState } from '@/redux/store'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

/**
 * One dua of a list (a collection or Favorites), swipeable through the rest of the list.
 * Opened from a row of the Collection or Favorites screen with `id` (the dua), `list` (which list)
 * and `ids` (the duas of that list as they were on screen, after any filter or search).
 */
export default function DuaRoute() {
  const { id, list, ids: idsParam } = useLocalSearchParams<{ id: string; list?: string; ids?: string }>()
  const router = useRouter()
  const allDuas = useSelector((state: RootState) => state.duas.items)

  // Fix the list and the starting dua when the screen opens, so un-favoriting a dua while
  // looking through Favorites doesn't make it vanish from under the swipe.
  const [{ ids, initialIndex }] = useState(() => {
    const listIds = idsParam ? idsParam.split(',') : getListDuas(allDuas, list).map((dua) => dua.id)
    return { ids: listIds, initialIndex: Math.max(0, listIds.indexOf(id)) }
  })
  // the latest version of each dua (its favorite state changes while we are here)
  const duas = useMemo(
    () => ids.map((duaId) => allDuas.find((dua) => dua.id === duaId)).filter((dua): dua is Dua => !!dua),
    [ids, allDuas],
  )

  if (duas.length === 0) return null

  return (
    <DuaScreen
      title={list === FAVORITES_LIST_ID ? 'Favorites' : getCollectionName(list ?? '')}
      duas={duas}
      initialIndex={initialIndex}
      onBack={() => router.back()}
    />
  )
}
