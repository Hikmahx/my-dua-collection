import { useEffect, useState } from 'react'
import { AppState } from 'react-native'

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

/**
 * A value that changes when the calendar day changes (at midnight, or when the app comes back to the front after
 * the day changed). Use it as a dependency so something worked out per day, like the Hijri date, is not stale in an
 * app that stays open overnight.
 */
export function useToday(): string {
  const [key, setKey] = useState(() => dayKey(new Date()))

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    const refresh = () => setKey(dayKey(new Date()))

    const scheduleMidnight = () => {
      const now = new Date()
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1)
      timer = setTimeout(() => {
        refresh()
        scheduleMidnight()
      }, nextMidnight.getTime() - now.getTime())
    }

    scheduleMidnight()
    // a timer does not run while the app is in the background, so check again when it comes back
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return
      refresh()
      if (timer) clearTimeout(timer)
      scheduleMidnight()
    })

    return () => {
      if (timer) clearTimeout(timer)
      subscription.remove()
    }
  }, [])

  return key
}
