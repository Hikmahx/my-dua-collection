import { NotificationRow } from '@/components/notifications/notification-row'
import { BackButton } from '@/components/ui/back-button'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { ScreenHeader } from '@/components/ui/screen-header'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useT } from '@/hooks/use-t'
import { duaRoute } from '@/lib/reminders/open-dua'
import tw from '@/lib/tailwind'
import { allNotificationsRead, notificationRead, notificationsCleared } from '@/redux/reducers/notificationsSlice'
import type { RootState } from '@/redux/store'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The notification centre: the reminders that have been sent, newest first, kept on the device. Tapping one marks it
 * read and, when it is about a dua (the daily reminder), opens that dua.
 */
export default function NotificationsScreen() {
  const c = useSettingsColors()
  const t = useT()
  const router = useRouter()
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.notifications.items)
  const duas = useSelector((state: RootState) => state.duas.items)
  const [confirmingClear, setConfirmingClear] = useState(false)
  const now = new Date()
  const hasUnread = items.some((item) => !item.read)

  const open = (id: string, duaId?: string) => {
    dispatch(notificationRead(id))
    const dua = duaId ? duas.find((entry) => entry.id === duaId) : undefined
    if (dua) router.push(duaRoute(dua))
  }

  const actions = items.length > 0 && (
    <View style={tw`flex-row items-center`}>
      {hasUnread && (
        <Pressable
          onPress={() => dispatch(allNotificationsRead())}
          hitSlop={10}
          accessibilityRole='button'
          accessibilityLabel={t('centre.markAllRead')}
          style={tw`mr-[18px]`}
        >
          <MaterialCommunityIcons name='check-all' size={24} color={c.title} />
        </Pressable>
      )}
      <Pressable
        onPress={() => setConfirmingClear(true)}
        hitSlop={10}
        accessibilityRole='button'
        accessibilityLabel={t('centre.clear')}
      >
        <Feather name='trash-2' size={22} color={c.title} />
      </Pressable>
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: c.body }}>
      <ScreenHeader
        title={t('centre.title')}
        bottomPadding={14}
        left={<BackButton onPress={() => router.back()} color={c.title} />}
        right={actions || null}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={items.length === 0 ? tw`flex-1` : tw`pt-4 pb-10`}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: c.divider }} />}
        renderItem={({ item }) => <NotificationRow item={item} now={now} onPress={() => open(item.id, item.duaId)} />}
        ListEmptyComponent={
          <View style={tw`flex-1 items-center justify-center px-[40px]`}>
            <MaterialCommunityIcons name='bell-outline' size={48} color={c.muted} />
            <Text style={[tw`font-nunito-bold text-[16px] mt-[14px]`, { color: c.title }]}>{t('centre.empty')}</Text>
            <Text style={[tw`font-nunito text-[13px] leading-[19px] text-center mt-[6px]`, { color: c.muted }]}>
              {t('centre.emptyBody')}
            </Text>
          </View>
        }
      />

      <ConfirmModal
        visible={confirmingClear}
        title={t('centre.clearTitle')}
        message={t('centre.clearMessage')}
        confirmLabel={t('centre.clear')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => {
          dispatch(notificationsCleared())
          setConfirmingClear(false)
        }}
        onCancel={() => setConfirmingClear(false)}
      />
    </View>
  )
}
