import { useNotificationPermission } from '@/components/notifications/notification-permission-provider'
import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'
import { ToggleSwitch } from '@/components/settings/toggle-switch'
import { useReminderSettings } from '@/hooks/use-reminder-settings'
import { useT } from '@/hooks/use-t'
import { useUnreadCount } from '@/hooks/use-unread-count'
import { formatReminderTime } from '@/lib/reminders/format'
import { useRouter } from 'expo-router'

/**
 * The Notifications card: preferences (time, permission, test), the notification centre, and the two toggles.
 * Turning a toggle on makes sure notifications are allowed first (see useReminderSettings).
 */
export function NotificationSettings({ variant }: { variant?: SettingsVariant }) {
  const router = useRouter()
  const t = useT()
  const unread = useUnreadCount()
  const { permission } = useNotificationPermission()
  const settings = useReminderSettings()

  return (
    <SettingsGroup title={t('notifications.title')} variant={variant}>
      <SettingsRow
        icon='bell-outline'
        title={t('notifications.preferences')}
        subtitle={
          permission && permission.status !== 'granted'
            ? t('notifications.permissionOff')
            : t('notifications.preferencesSubtitle')
        }
        onPress={() => router.push('/notification-preferences')}
      />
      <SettingsRow
        icon='bell-badge-outline'
        title={t('notifications.center')}
        subtitle={unread === 0 ? t('notifications.centerNone') : t('notifications.centerNew', { count: unread })}
        onPress={() => router.push('/notifications')}
      />
      <SettingsRow
        icon='clock-outline'
        title={t('notifications.daily')}
        subtitle={t('notifications.dailySubtitle', { time: formatReminderTime(settings.dailyTime) })}
        control={
          <ToggleSwitch
            value={settings.dailyOn}
            onValueChange={settings.toggleDaily}
            accessibilityLabel={t('notifications.daily')}
          />
        }
      />
      <SettingsRow
        icon='calendar-month-outline'
        title={t('notifications.monthly')}
        subtitle={t('notifications.monthlySubtitle')}
        control={
          <ToggleSwitch
            value={settings.specialOn}
            onValueChange={settings.toggleSpecial}
            accessibilityLabel={t('notifications.monthly')}
          />
        }
      />
    </SettingsGroup>
  )
}
