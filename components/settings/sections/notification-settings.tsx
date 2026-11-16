import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'
import { ToggleSwitch } from '@/components/settings/toggle-switch'
import { DAILY_REMINDER_TIME } from '@/constants/settings-config'
import { setDailyReminder, setMonthlyReminders } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'

export function NotificationSettings({ variant }: { variant?: SettingsVariant }) {
  const dispatch = useDispatch()
  const { dailyReminder, monthlyReminders } = useSelector((state: RootState) => state.settings)

  return (
    <SettingsGroup title='Notifications' variant={variant}>
      <SettingsRow
        icon='bell-outline'
        title='Notification preferences'
        subtitle='Sound, vibration & alerts'
      />
      <SettingsRow
        icon='clock-outline'
        title='Daily reminder'
        subtitle={`Every day · ${DAILY_REMINDER_TIME}`}
        control={
          <ToggleSwitch
            value={dailyReminder}
            onValueChange={(on) => dispatch(setDailyReminder(on))}
            accessibilityLabel='Daily reminder'
          />
        }
      />
      <SettingsRow
        icon='calendar-month-outline'
        title='Monthly reminders'
        subtitle='Ramadan & other months'
        chevron
        control={
          <ToggleSwitch
            value={monthlyReminders}
            onValueChange={(on) => dispatch(setMonthlyReminders(on))}
            accessibilityLabel='Monthly reminders'
          />
        }
      />
    </SettingsGroup>
  )
}
