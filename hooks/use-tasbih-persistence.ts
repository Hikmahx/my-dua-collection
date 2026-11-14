import { loadTasbihState, saveTasbihState } from '@/lib/tasbih-storage'
import { hydrateTasbih } from '@/redux/reducers/tasbihSlice'
import type { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const SAVE_DELAY_MS = 400

/**
 * Restores the saved Tasbih state on launch and saves every later change.
 * Saves are debounced so fast tapping doesn't write to storage on every tap.
 * Returns true once the saved state has been loaded.
 */
export function useTasbihPersistence(): boolean {
  const dispatch = useDispatch()
  const tasbih = useSelector((state: RootState) => state.tasbih)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadTasbihState().then((saved) => {
      if (!active) return
      if (saved) dispatch(hydrateTasbih(saved))
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [dispatch])

  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => saveTasbihState(tasbih), SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [tasbih, ready])

  return ready
}
