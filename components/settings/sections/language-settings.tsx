import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'
import { languageName } from '@/constants/settings-config'
import type { RootState } from '@/redux/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/**
 * App language and translation languages. Used on the Settings screen and (with
 * variant="flat") in the dua sidebar, so everything it needs comes from the store.
 */
export function LanguageSettings({ variant }: { variant?: SettingsVariant }) {
  const language = useSelector((state: RootState) => state.settings.language)
  const duas = useSelector((state: RootState) => state.duas.items)

  // every language the duas have a translation in
  const translationLanguages = useMemo(
    () => [...new Set(duas.flatMap((dua) => Object.keys(dua.translations)))].map(languageName),
    [duas],
  )

  return (
    <SettingsGroup title='Language & translation' variant={variant}>
      <SettingsRow icon='earth' title='App language' subtitle={languageName(language)} />
      <SettingsRow
        icon='translate'
        title='Translation languages'
        subtitle={`${translationLanguages.join(', ')} · Add languages`}
      />
    </SettingsGroup>
  )
}
