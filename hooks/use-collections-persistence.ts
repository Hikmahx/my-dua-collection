import { loadCollections, saveCollections } from '@/lib/collections-storage'
import { setCollections } from '@/redux/reducers/collectionsSlice'
import type { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const SAVE_DELAY_MS = 400

/**
 * Restores the collections the user made on launch and saves every later change (edit, delete, a
 * dua added). Returns true once the saved ones have been loaded.
 */
export function useCollectionsPersistence(): boolean {
  const dispatch = useDispatch()
  const collections = useSelector((state: RootState) => state.collections.items)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadCollections().then((saved) => {
      if (!active) return
      if (saved) dispatch(setCollections(saved))
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [dispatch])

  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => saveCollections(collections), SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [collections, ready])

  return ready
}
