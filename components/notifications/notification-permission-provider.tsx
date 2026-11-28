import { BottomSheet } from '@/components/ui/bottom-sheet'
import { GoldButton } from '@/components/ui/gold-button'
import { PillButton } from '@/components/ui/pill-button'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useT } from '@/hooks/use-t'
import {
  getPermission,
  openNotificationSettings,
  requestPermission,
  type PermissionState,
} from '@/lib/reminders/scheduler'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AppState, Text, View } from 'react-native'

interface PermissionContextValue {
  /** The system's answer, or null until it has been read. */
  permission: PermissionState | null
  /**
   * Makes sure notifications are allowed, asking if they are not: first this app's own explanation ("why do you
   * want to send me notifications?"), then the system question. Resolves true when they are allowed. When the answer
   * is no it shows a message with a way to the phone's settings, and resolves false.
   */
  ensure: () => Promise<boolean>
  /** Reads the permission again (after coming back from the phone's settings). */
  refresh: () => Promise<PermissionState>
}

const PermissionContext = createContext<PermissionContextValue | null>(null)

type Sheet = 'explain' | 'denied' | null

/**
 * Holds the notification permission and the two sheets that go with asking for it (the explanation before the
 * system question, and the message after a "no"). Mount it once in the root layout; screens use
 * `useNotificationPermission()`.
 */
export function NotificationPermissionProvider({ children }: { children: ReactNode }) {
  const c = useSettingsColors()
  const t = useT()
  const [permission, setPermission] = useState<PermissionState | null>(null)
  const [sheet, setSheet] = useState<Sheet>(null)
  const [asking, setAsking] = useState(false)
  const pending = useRef<((allowed: boolean) => void) | null>(null)

  const refresh = useCallback(async () => {
    const current = await getPermission()
    setPermission(current)
    return current
  }, [])

  // read on launch, and again when the app comes back to the front (the user may have used the phone's settings)
  useEffect(() => {
    refresh()
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh()
    })
    return () => subscription.remove()
  }, [refresh])

  const settle = useCallback((allowed: boolean) => {
    pending.current?.(allowed)
    pending.current = null
  }, [])

  const ensure = useCallback(async () => {
    const current = await refresh()
    if (current.status === 'granted') return true
    settle(false) // a question that is still open is answered "no"
    if (current.status === 'denied' && !current.canAskAgain) {
      setSheet('denied')
      return false
    }
    return new Promise<boolean>((resolve) => {
      pending.current = resolve
      setSheet('explain')
    })
  }, [refresh, settle])

  const allow = async () => {
    setAsking(true)
    const result = await requestPermission()
    setAsking(false)
    setPermission(result)
    if (result.status === 'granted') {
      setSheet(null)
      settle(true)
    } else {
      // the user said no to the system question: say what that means and how to change it
      setSheet('denied')
      settle(false)
    }
  }

  const close = () => {
    setSheet(null)
    settle(false)
  }

  const value = useMemo(() => ({ permission, ensure, refresh }), [permission, ensure, refresh])

  return (
    <PermissionContext.Provider value={value}>
      {children}

      <BottomSheet visible={sheet !== null} onClose={close} backgroundColor={c.card} handleColor={c.divider}>
        <View style={tw`px-[24px] pt-[8px] pb-[24px] items-center`}>
          <View style={[tw`w-[64px] h-[64px] rounded-full items-center justify-center`, { backgroundColor: c.avatarBg }]}>
            <MaterialCommunityIcons
              name={sheet === 'denied' ? 'bell-off-outline' : 'bell-ring-outline'}
              size={32}
              color={c.accent}
            />
          </View>

          <Text style={[tw`font-nunito-bold text-[18px] text-center mt-[16px]`, { color: c.title }]}>
            {sheet === 'denied' ? t('permission.deniedTitle') : t('permission.explainTitle')}
          </Text>
          <Text style={[tw`font-nunito text-[14px] leading-[21px] text-center mt-[8px]`, { color: c.muted }]}>
            {sheet === 'denied' ? t('permission.deniedBody') : t('permission.explainBody')}
          </Text>

          <View style={tw`self-stretch mt-[22px]`}>
            {sheet === 'denied' ? (
              <GoldButton
                label={t('permission.openSettings')}
                onPress={() => {
                  openNotificationSettings()
                  close()
                }}
              />
            ) : (
              <GoldButton label={t('permission.explainAllow')} onPress={allow} disabled={asking} />
            )}
            <PillButton
              label={sheet === 'denied' ? t('common.close') : t('permission.notNow')}
              onPress={close}
              backgroundColor='transparent'
              textColor={c.title}
              borderColor={c.divider}
              style={tw`mt-[10px]`}
            />
          </View>
        </View>
      </BottomSheet>
    </PermissionContext.Provider>
  )
}

export function useNotificationPermission(): PermissionContextValue {
  const context = useContext(PermissionContext)
  if (!context) throw new Error('useNotificationPermission needs <NotificationPermissionProvider> above it')
  return context
}
