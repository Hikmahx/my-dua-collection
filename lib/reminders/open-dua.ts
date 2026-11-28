import type { Dua } from '@/redux/reducers/duasSlice'

/**
 * Where to go to open one dua on its own (from a notification): the Dua screen with just that dua, titled with the
 * first collection it is in.
 */
export const duaRoute = (dua: Pick<Dua, 'id' | 'collection'>) =>
  ({
    pathname: '/dua/[id]',
    params: { id: dua.id, ids: dua.id, ...(dua.collection?.[0] ? { list: dua.collection[0] } : {}) },
  }) as const
