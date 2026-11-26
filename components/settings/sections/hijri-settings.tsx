import { OptionSheet } from '@/components/settings/option-sheet'
import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'
import { useT } from '@/hooks/use-t'
import { HIJRI_ADJUSTMENTS, isHijriAdjustment, type HijriAdjustment } from '@/lib/islamic-season'
import type { TranslationKey } from '@/locales'
import { setHijriAdjustment } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const LABELS: Record<HijriAdjustment, { label: TranslationKey; hint: TranslationKey }> = {
  [-1]: { label: 'hijri.behind', hint: 'hijri.behindHint' },
  0: { label: 'hijri.none', hint: 'hijri.noneHint' },
  1: { label: 'hijri.ahead', hint: 'hijri.aheadHint' },
}

/**
 * "Hijri date adjustment": lets the user move the Islamic date a day either way to match their own moon sighting
 * (the calendar the app follows, Umm al-Qura, can differ by a day). It changes the date shown in the app and the
 * days of Ramadan and Eid (lib/islamic-season.ts).
 */
export function HijriSettings({ variant }: { variant?: SettingsVariant }) {
  const t = useT()
  const dispatch = useDispatch()
  const adjustment = useSelector((state: RootState) => state.settings.hijriAdjustment)
  const [open, setOpen] = useState(false)

  const options = HIJRI_ADJUSTMENTS.map((value) => ({
    id: String(value),
    label: t(LABELS[value].label),
    sublabel: t(LABELS[value].hint),
  }))

  return (
    <>
      <SettingsGroup title={t('hijri.title')} variant={variant}>
        <SettingsRow
          icon='calendar-star'
          title={t('hijri.adjustment')}
          subtitle={t(LABELS[adjustment].label)}
          onPress={() => setOpen(true)}
        />
      </SettingsGroup>

      <OptionSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={t('hijri.adjustment')}
        subtitle={t('hijri.sheetSubtitle')}
        options={options}
        selected={String(adjustment)}
        onSelect={(id) => {
          const value = Number(id)
          if (isHijriAdjustment(value)) dispatch(setHijriAdjustment(value))
        }}
        footnote={t('hijri.footnote')}
      />
    </>
  )
}
