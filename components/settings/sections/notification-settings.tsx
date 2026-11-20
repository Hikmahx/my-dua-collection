import { useT } from '@/hooks/use-t'
import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'
import { ToggleSwitch } from '@/components/settings/toggle-switch'
import { DAILY_REMINDER_TIME } from '@/constants/settings-config'
import { setDailyReminder, setMonthlyReminders } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'

export function NotificationSettings({ variant }: { variant?: SettingsVariant }) {
  const dispatch = useDispatch()
  const t = useT()
  const { dailyReminder, monthlyReminders } = useSelector((state: RootState) => state.settings)

  return (
    <SettingsGroup title={t('notifications.title')} variant={variant}>
      <SettingsRow
        icon='bell-outline'
        title={t('notifications.preferences')}
        subtitle={t('notifications.preferencesSubtitle')}
      />
      <SettingsRow
        icon='clock-outline'
        title={t('notifications.daily')}
        subtitle={t('notifications.dailySubtitle', { time: DAILY_REMINDER_TIME })}
        control={
          <ToggleSwitch
            value={dailyReminder}
            onValueChange={(on) => dispatch(setDailyReminder(on))}
            accessibilityLabel={t('notifications.daily')}
          />
        }
      />
      <SettingsRow
        icon='calendar-month-outline'
        title={t('notifications.monthly')}
        subtitle={t('notifications.monthlySubtitle')}
        chevron
        control={
          <ToggleSwitch
            value={monthlyReminders}
            onValueChange={(on) => dispatch(setMonthlyReminders(on))}
            accessibilityLabel={t('notifications.monthly')}
          />
        }
      />
    </SettingsGroup>
  )
}
