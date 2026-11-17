import { AUTO_ADVANCE_DELAY_MS } from '@/constants/dua-config'
import { useTasbihFeedback } from '@/hooks/use-tasbih-feedback'
import { getDuaRepeat } from '@/lib/dua-utils'
import type { Dua } from '@/redux/reducers/duasSlice'
import { useEffect, useRef, useState } from 'react'
import { FlatList, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native'

/**
 * The logic of the Dua screen: which dua is showing, and the counter that counts down from the
 * dua's repeat count (`repeat`).
 * - Swiping to another dua starts its counter again, with no confirmation.
 * - When the counter reaches 0 the next dua slides in by itself, except on the last dua, where
 *   it just stays at 0.
 * - The list is a pager, so you can't swipe back from the first dua or forward from the last.
 */
export function useDuaPager(duas: Dua[], initialIndex: number) {
  const { width } = useWindowDimensions()
  const listRef = useRef<FlatList<Dua>>(null)
  const [index, setIndex] = useState(initialIndex)
  const [taps, setTaps] = useState(0)
  // refs hold the latest values for taps that arrive faster than React re-renders
  const indexRef = useRef(initialIndex)
  const tapsRef = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const feedback = useTasbihFeedback() // sound and vibration, following the toggles on the Tasbih screen

  const dua = duas[Math.min(index, duas.length - 1)]
  const repeat = getDuaRepeat(dua)
  const remaining = Math.max(0, repeat - taps)

  const cancelAutoAdvance = () => clearTimeout(timer.current)
  useEffect(() => cancelAutoAdvance, [])

  /** Makes another dua the current one. The counter starts again. */
  const showDua = (next: number) => {
    cancelAutoAdvance()
    indexRef.current = next
    tapsRef.current = 0
    setIndex(next)
    setTaps(0)
  }

  const tap = () => {
    const current = duas[indexRef.current]
    if (tapsRef.current >= getDuaRepeat(current)) return // already at 0

    tapsRef.current += 1
    setTaps(tapsRef.current)

    const reachedZero = tapsRef.current >= getDuaRepeat(current)
    if (reachedZero) feedback.targetReached()
    else feedback.tap()
    if (reachedZero && indexRef.current < duas.length - 1) {
      timer.current = setTimeout(() => {
        const next = indexRef.current + 1
        listRef.current?.scrollToIndex({ index: next, animated: true })
        showDua(next)
      }, AUTO_ADVANCE_DELAY_MS)
    }
  }

  /** The user finished a swipe. */
  const onSwipeEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width)
    if (next !== indexRef.current) showDua(next)
  }

  return { listRef, width, index, dua, repeat, remaining, tap, onSwipeEnd }
}
