import { TOAST_LONG_MS, TOAST_SHORT_MS, type ToastKind } from '@/constants/toast-theme'
import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AccessibilityInfo, Platform, ToastAndroid } from 'react-native'

export interface ToastOptions {
  message: string
  kind?: ToastKind
  /** Stay a bit longer (for a message with two parts). */
  long?: boolean
}

export interface ActiveToast {
  /** Changes with every toast, so a new one replaces the old even when the text is the same. */
  key: number
  message: string
  kind: ToastKind
}

interface ToastContextValue {
  show: (options: ToastOptions) => void
  dismiss: () => void
  /** The toast on screen (iOS only; Android's is native and not tracked). */
  toast: ActiveToast | null
  /** Hosts (see ToastHost) say they are on screen; only the newest one draws the toast. */
  registerHost: (id: string) => () => void
  activeHostId: string | null
}

export const ToastContext = createContext<ToastContextValue | null>(null)

/**
 * Keeps the toast and shows it. On Android it is the phone's own toast (ToastAndroid). iOS has none, so the toast
 * is kept here and drawn by a ToastHost: a banner at the top of the screen. A native Modal covers everything under
 * it, so each Modal (and the Add dua screen) holds its own ToastHost, and the one opened last draws the toast.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ActiveToast | null>(null)
  const [hosts, setHosts] = useState<string[]>([])
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const counter = useRef(0)

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }

  const dismiss = useCallback(() => {
    clearTimer()
    setToast(null)
  }, [])

  const show = useCallback(
    ({ message, kind = 'info', long = false }: ToastOptions) => {
      if (!message) return
      const duration = long ? TOAST_LONG_MS : TOAST_SHORT_MS

      if (Platform.OS === 'android') {
        ToastAndroid.show(message, long ? ToastAndroid.LONG : ToastAndroid.SHORT)
        return
      }

      clearTimer()
      counter.current += 1
      setToast({ key: counter.current, message, kind })
      // VoiceOver does not read a banner by itself
      AccessibilityInfo.announceForAccessibility(message)
      timer.current = setTimeout(dismiss, duration)
    },
    [dismiss],
  )

  useEffect(() => clearTimer, [])

  const registerHost = useCallback((id: string) => {
    setHosts((current) => [...current, id])
    return () => setHosts((current) => current.filter((host) => host !== id))
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({ show, dismiss, toast, registerHost, activeHostId: hosts[hosts.length - 1] ?? null }),
    [show, dismiss, toast, registerHost, hosts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
