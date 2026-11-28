import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useT } from '@/hooks/use-t'
import { useUnreadCount } from '@/hooks/use-unread-count'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

/** The bell for a screen header: opens the notification centre, with the number of unread notifications on it. */
export function NotificationBell({ color }: { color: string }) {
  const c = useSettingsColors()
  const t = useT()
  const router = useRouter()
  const unread = useUnreadCount()

  return (
    <Pressable
      onPress={() => router.push('/notifications')}
      hitSlop={12}
      accessibilityRole='button'
      accessibilityLabel={unread > 0 ? `${t('centre.bell')}, ${t('notifications.centerNew', { count: unread })}` : t('centre.bell')}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <MaterialCommunityIcons name={unread > 0 ? 'bell-badge-outline' : 'bell-outline'} size={26} color={color} />
      {unread > 0 && (
        <View
          style={[
            tw`absolute items-center justify-center rounded-full`,
            { top: -5, right: -6, minWidth: 16, height: 16, paddingHorizontal: 3, backgroundColor: c.danger },
          ]}
        >
          <Text style={tw`font-nunito-bold text-[10px] text-white`}>{unread > 9 ? '9+' : unread}</Text>
        </View>
      )}
    </Pressable>
  )
}
