import { getCollectionName, type CollectionDef, type UserCollection } from '@/constants/collections'
import { getAllCollections } from '@/lib/collection-utils'
import type { RootState } from '@/redux/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/** Every collection (pre-made and the user's own), with a name lookup that knows about both. */
export function useCollections() {
  const userCollections = useSelector((state: RootState) => state.collections.items)

  return useMemo(() => {
    const collections = getAllCollections(userCollections)
    return {
      userCollections: userCollections as UserCollection[],
      collections,
      getName: (id: string) => getCollectionName(id, userCollections),
      find: (id: string): CollectionDef | undefined => collections.find((c) => c.id === id),
    }
  }, [userCollections])
}
