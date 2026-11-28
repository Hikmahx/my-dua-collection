import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useT } from '@/hooks/use-t'
import { timeAgo } from '@/lib/reminders/format'
import type { ReminderKind } from '@/lib/reminders/types'
import tw from '@/lib/tailwind'
import type { NotificationItem } from '@/redux/reducers/notificationsSlice'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { Pressable, Text, View } from 'react-native'

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name']

const ICONS: Record<ReminderKind, IconName> = {
  daily: 'book-open-variant',
  countdown: 'timer-sand',
  occasion: 'star-crescent',
  night: 'moon-waning-crescent',
}

interface NotificationRowProps {
  item: NotificationItem
  now: Date
  onPress: () => void
}

/** One notification of the centre: a round icon, title, text and how long ago, with a dot while it is unread. */
export function NotificationRow({ item, now, onPress }: NotificationRowProps) {
  const c = useSettingsColors()
  const t = useT()

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={`${item.read ? '' : '• '}${item.title}. ${item.body}`}
      style={({ pressed }) => [
        tw`flex-row px-4 py-[14px]`,
        { backgroundColor: c.card, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={[tw`w-[40px] h-[40px] rounded-full items-center justify-center mr-[12px]`, { backgroundColor: c.avatarBg }]}>
        <MaterialCommunityIcons name={ICONS[item.kind]} size={22} color={c.accent} />
      </View>

      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center`}>
          <Text
            numberOfLines={2}
            style={[tw`flex-1 text-[14px] ${item.read ? 'font-nunito-semibold' : 'font-nunito-bold'}`, { color: c.title }]}
          >
            {item.title}
          </Text>
          {!item.read && <View style={[tw`w-[8px] h-[8px] rounded-full ml-[8px]`, { backgroundColor: c.accent }]} />}
        </View>
        <Text numberOfLines={3} style={[tw`font-nunito text-[13px] leading-[19px] mt-[3px]`, { color: c.muted }]}>
          {item.body}
        </Text>
        <Text style={[tw`font-nunito text-[11px] mt-[6px]`, { color: c.muted }]}>{timeAgo(item.createdAt, now, t)}</Text>
      </View>
    </Pressable>
  )
}
