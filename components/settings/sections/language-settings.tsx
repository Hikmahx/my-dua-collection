import { LanguageSheet } from '@/components/settings/language-sheet'
import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'
import { APP_LANGUAGE_CODES, getLanguage, isAppLanguageCode, LANGUAGES } from '@/constants/languages'
import { useT } from '@/hooks/use-t'
import { setAppLanguage, setTranslationLanguage } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/**
 * App language (the app's own text) and translation language (which translation of a dua is shown).
 * Used on the Settings screen and (with variant="flat") in the dua sidebar, so everything it
 * needs comes from the store.
 */
export function LanguageSettings({ variant }: { variant?: SettingsVariant }) {
  const t = useT()
  const dispatch = useDispatch()
  const appLanguage = useSelector((state: RootState) => state.settings.appLanguage)
  const translationLanguage = useSelector((state: RootState) => state.settings.translationLanguage)
  const duas = useSelector((state: RootState) => state.duas.items)
  const [openSheet, setOpenSheet] = useState<'app' | 'translation' | null>(null)

  const appOptions = APP_LANGUAGE_CODES.map((code) => ({ code, label: getLanguage(code).nativeName }))

  // how many duas have a translation in each language
  const translationOptions = useMemo(
    () =>
      LANGUAGES.map(({ code, name, nativeName }) => ({
        code,
        label: code === 'en' ? name : `${name} · ${nativeName}`,
        sublabel: t('language.translatedCount', {
          count: duas.filter((dua) => !!dua.translations[code]).length,
          total: duas.length,
        }),
      })),
    [duas, t],
  )

  return (
    <>
      <SettingsGroup title={t('language.title')} variant={variant}>
        <SettingsRow
          icon='earth'
          title={t('language.app')}
          subtitle={getLanguage(appLanguage).nativeName}
          onPress={() => setOpenSheet('app')}
        />
        <SettingsRow
          icon='translate'
          title={t('language.translation')}
          subtitle={getLanguage(translationLanguage).name}
          onPress={() => setOpenSheet('translation')}
        />
      </SettingsGroup>

      <LanguageSheet
        visible={openSheet === 'app'}
        onClose={() => setOpenSheet(null)}
        title={t('language.app')}
        subtitle={t('language.appSubtitle')}
        options={appOptions}
        selected={appLanguage}
        onSelect={(code) => isAppLanguageCode(code) && dispatch(setAppLanguage(code))}
        footnote={t('language.moreSoon')}
      />
      <LanguageSheet
        visible={openSheet === 'translation'}
        onClose={() => setOpenSheet(null)}
        title={t('language.translation')}
        subtitle={t('language.translationSubtitle')}
        options={translationOptions}
        selected={translationLanguage}
        onSelect={(code) => dispatch(setTranslationLanguage(code))}
      />
    </>
  )
}
