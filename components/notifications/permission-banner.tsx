import { useNotificationPermission } from '@/components/notifications/notification-permission-provider'
import { GoldButton } from '@/components/ui/gold-button'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useT } from '@/hooks/use-t'
import { openNotificationSettings } from '@/lib/reminders/scheduler'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, View } from 'react-native'

/**
 * Shown on the Notification preferences screen while notifications are not allowed: says so, and offers to allow
 * them (or, when the system will not ask again, to open the phone's settings). Draws nothing once they are allowed.
 */
export function PermissionBanner() {
  const c = useSettingsColors()
  const t = useT()
  const { permission, ensure } = useNotificationPermission()

  if (!permission || permission.status === 'granted') return null
  const blocked = permission.status === 'denied' && !permission.canAskAgain

  return (
    <View style={[tw`mx-6 mb-6 rounded-2xl p-4`, { backgroundColor: c.card, borderWidth: 1, borderColor: c.accent }]}>
      <View style={tw`flex-row items-center`}>
        <MaterialCommunityIcons name='bell-off-outline' size={22} color={c.accent} style={tw`mr-[10px]`} />
        <Text style={[tw`font-nunito-bold text-[14px] flex-1`, { color: c.title }]}>{t('permission.bannerTitle')}</Text>
      </View>
      <Text style={[tw`font-nunito text-[13px] leading-[19px] mt-[8px]`, { color: c.muted }]}>
        {blocked ? t('permission.bannerBlocked') : t('permission.bannerBody')}
      </Text>
      <GoldButton
        label={blocked ? t('permission.openSettings') : t('permission.allow')}
        onPress={blocked ? openNotificationSettings : () => void ensure()}
        style={tw`mt-[14px]`}
      />
    </View>
  )
}
