import { toastTheme } from '@/constants/toast-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ToastContext, type ActiveToast } from '@/components/ui/toast-provider'
import tw from '@/lib/tailwind'
import { Ionicons } from '@expo/vector-icons'
import { useContext, useEffect, useId, useRef, useState } from 'react'
import { Animated, Platform, Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ICONS = { success: 'checkmark-circle', error: 'alert-circle', info: 'information-circle' } as const

/**
 * Draws the toast as a banner at the top of the screen (iOS; on Android the native toast is used and this draws
 * nothing). Put one in the app's root and one inside every Modal or modal screen: a native Modal covers whatever
 * is under it, so the toast has to be drawn inside it. Only the newest host on screen draws, and a toast stays
 * with the host that first drew it (it is not drawn a second time by another host when that one goes away).
 * `enabled={false}` takes the host out at once, e.g. for a sheet that is sliding closed.
 */
export function ToastHost({ enabled = true }: { enabled?: boolean }) {
  const context = useContext(ToastContext)
  const id = useId()
  const insets = useSafeAreaInsets()
  const c = toastTheme[useColorScheme() === 'dark' ? 'dark' : 'light']
  const progress = useRef(new Animated.Value(0)).current
  const [shown, setShown] = useState<ActiveToast | null>(null)

  const registerHost = context?.registerHost
  useEffect(() => (enabled ? registerHost?.(id) : undefined), [registerHost, id, enabled])

  const toast = context?.toast ?? null
  const isNewestHost = enabled && context?.activeHostId === id
  // drawn here when it is already ours, or when it is new and this is the newest host
  const active = toast && (toast.owner === id || (!toast.owner && isNewestHost)) ? toast : null

  const claim = context?.claim
  useEffect(() => {
    if (active && !active.owner) claim?.(active.key, id)
  }, [active, claim, id])

  useEffect(() => {
    if (active) {
      setShown(active)
      Animated.timing(progress, { toValue: 1, duration: 220, useNativeDriver: true }).start()
    } else {
      Animated.timing(progress, { toValue: 0, duration: 180, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setShown(null)
      })
    }
  }, [active, progress])

  if (Platform.OS === 'android' || !context || !shown) return null

  return (
    <View pointerEvents='box-none' style={[tw`absolute left-0 right-0 items-center px-[16px]`, { top: insets.top + 8, zIndex: 1000 }]}>
      <Animated.View
        style={{
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
          maxWidth: 420,
        }}
      >
        <Pressable
          onPress={context.dismiss}
          accessibilityRole='alert'
          accessibilityLabel={shown.message}
          style={[
            tw`flex-row items-center rounded-[16px] px-[14px] py-[12px]`,
            {
              backgroundColor: c.background,
              borderWidth: 1,
              borderColor: c.border,
              shadowColor: c.shadow,
              shadowOpacity: c.shadowOpacity,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
            },
          ]}
        >
          <Ionicons name={ICONS[shown.kind]} size={20} color={c.icon[shown.kind]} />
          <Text numberOfLines={3} style={[tw`font-nunito-semibold text-[14px] leading-[19px] ml-[10px] flex-shrink`, { color: c.text }]}>
            {shown.message}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  )
}