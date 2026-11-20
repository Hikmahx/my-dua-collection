import { makeT, type TFunction } from '@/locales'
import type { RootState } from '@/redux/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/** The app's text in the language chosen in Settings: const t = useT(); t('settings.title'). */
export function useT(): TFunction {
  const language = useSelector((state: RootState) => state.settings.appLanguage)
  return useMemo(() => makeT(language), [language])
}
