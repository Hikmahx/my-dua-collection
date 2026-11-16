import { loadSettings, saveSettings } from '@/lib/settings-storage'
import { hydrateSettings } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { Appearance } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const SAVE_DELAY_MS = 400

/**
 * Restores the saved settings on launch, applies the theme, and saves every later change.
 * The theme is applied before the app shows, so there is no light/dark flash. Saves are
 * debounced so dragging a font size slider doesn't write to storage on every move.
 * Returns true once the saved settings have been loaded.
 */
export function useSettingsPersistence(): boolean {
  const dispatch = useDispatch()
  const settings = useSelector((state: RootState) => state.settings)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadSettings().then((saved) => {
      if (!active) return
      if (saved) dispatch(hydrateSettings(saved))
      Appearance.setColorScheme?.(saved?.theme ?? 'dark') // not available on web
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [dispatch])

  useEffect(() => {
    if (ready) Appearance.setColorScheme?.(settings.theme)
  }, [settings.theme, ready])

  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => saveSettings(settings), SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [settings, ready])

  return ready
}
