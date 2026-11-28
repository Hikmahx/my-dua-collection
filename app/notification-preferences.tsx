import { PermissionBanner } from '@/components/notifications/permission-banner'
import { TimePickerSheet } from '@/components/notifications/time-picker-sheet'
import { SettingsGroup } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'
import { ToggleSwitch } from '@/components/settings/toggle-switch'
import { BackButton } from '@/components/ui/back-button'
import { ScreenHeader } from '@/components/ui/screen-header'
import { useReminderSettings } from '@/hooks/use-reminder-settings'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useT } from '@/hooks/use-t'
import { useToast } from '@/hooks/use-toast'
import { useUnreadCount } from '@/hooks/use-unread-count'
import { formatReminderTime } from '@/lib/reminders/format'
import { getPermission, scheduleTestNotification } from '@/lib/reminders/scheduler'
import tw from '@/lib/tailwind'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useNotificationPermission } from '@/components/notifications/notification-permission-provider'

/**
 * Notification preferences: whether notifications are allowed (with a way to allow them), the daily reminder and
 * its time, the special reminders, the notification centre, and a button that sends a test notification.
 */
export default function NotificationPreferencesScreen() {
  const c = useSettingsColors()
  const t = useT()
  const router = useRouter()
  const toast = useToast()
  const unread = useUnreadCount()
  const { ensure } = useNotificationPermission()
  const settings = useReminderSettings()
  const [pickingTime, setPickingTime] = useState(false)

  const sendTest = async () => {
    if (!(await ensure())) return
    if ((await getPermission()).status !== 'granted') return
    await scheduleTestNotification(t('notificationPrefs.testTitle'), t('notificationPrefs.testBody'))
    toast.success(t('notificationPrefs.testSent'))
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.body }}>
      <ScreenHeader
        title={t('notificationPrefs.title')}
        bottomPadding={14}
        left={<BackButton onPress={() => router.back()} color={c.title} />}
        right={null}
      />

      <ScrollView contentContainerStyle={tw`pt-4 pb-10`} showsVerticalScrollIndicator={false}>
        <PermissionBanner />

        <SettingsGroup title={t('notificationPrefs.daily')}>
          <SettingsRow
            icon='clock-outline'
            title={t('notificationPrefs.daily')}
            subtitle={t('notificationPrefs.dailyHint')}
            control={
              <ToggleSwitch
                value={settings.dailyOn}
                onValueChange={settings.toggleDaily}
                accessibilityLabel={t('notificationPrefs.daily')}
              />
            }
          />
          <SettingsRow
            icon='alarm'
            title={t('notificationPrefs.time')}
            subtitle={formatReminderTime(settings.dailyTime)}
            onPress={() => setPickingTime(true)}
          />
        </SettingsGroup>

        <SettingsGroup title={t('notificationPrefs.special')}>
          <SettingsRow
            icon='calendar-star'
            title={t('notificationPrefs.special')}
            control={
              <ToggleSwitch
                value={settings.specialOn}
                onValueChange={settings.toggleSpecial}
                accessibilityLabel={t('notificationPrefs.special')}
              />
            }
          />
          <View style={tw`py-[12px]`}>
            <Text style={[tw`font-nunito text-[12px] leading-[18px]`, { color: c.muted }]}>
              {t('notificationPrefs.specialHint')}
            </Text>
          </View>
        </SettingsGroup>

        <SettingsGroup title={t('centre.title')}>
          <SettingsRow
            icon='bell-outline'
            title={t('notifications.center')}
            subtitle={unread === 0 ? t('notifications.centerNone') : t('notifications.centerNew', { count: unread })}
            onPress={() => router.push('/notifications')}
          />
          <SettingsRow
            icon='bell-ring-outline'
            title={t('notificationPrefs.test')}
            subtitle={t('notificationPrefs.testSubtitle')}
            onPress={sendTest}
          />
        </SettingsGroup>
      </ScrollView>

      <TimePickerSheet
        visible={pickingTime}
        value={settings.dailyTime}
        onClose={() => setPickingTime(false)}
        onConfirm={settings.setDailyTime}
      />
    </View>
  )
}
