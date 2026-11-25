import { loadKindred, saveKindred } from '@/lib/kindred-storage'
import { hydrateKindred } from '@/redux/reducers/kindredSlice'
import type { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Restores the saved kindred and shares on launch (the dummy data in data/ on the first launch) and
 * saves every later change. Returns true once the saved ones have been loaded.
 */
export function useKindredPersistence(): boolean {
  const dispatch = useDispatch()
  const kindred = useSelector((state: RootState) => state.kindred)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadKindred().then((saved) => {
      if (!active) return
      if (saved) dispatch(hydrateKindred(saved))
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [dispatch])

  useEffect(() => {
    if (ready) saveKindred(kindred)
  }, [kindred, ready])

  return ready
}
