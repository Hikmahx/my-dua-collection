import { sliderRatio, sliderValueFromX } from '@/lib/slider'
import { useRef, useState } from 'react'
import { PanResponder, View } from 'react-native'

const TRACK_HEIGHT = 4
const THUMB = 18
const HIT_HEIGHT = 32 // the touch area is taller than the track, so it is easy to grab

interface SliderProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  trackColor: string
  fillColor: string
  thumbColor: string
  accessibilityLabel: string
}

/**
 * A plain slider drawn in code (no native module), so it looks the same on iOS, Android and web.
 * Touch or drag anywhere on it to set the value.
 */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  trackColor,
  fillColor,
  thumbColor,
  accessibilityLabel,
}: SliderProps) {
  const [width, setWidth] = useState(0)
  const widthRef = useRef(0)
  const startX = useRef(0)
  // the gesture handlers below are created once, so they read the latest props from here
  const latest = useRef({ value, min, max, step, onChange })
  latest.current = { value, min, max, step, onChange }

  const setFromX = (x: number) => {
    const { min, max, step, onChange, value } = latest.current
    const next = sliderValueFromX(x, widthRef.current, THUMB, min, max, step)
    if (next !== value) onChange(next)
  }

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        startX.current = event.nativeEvent.locationX
        setFromX(startX.current)
      },
      onPanResponderMove: (_, gesture) => setFromX(startX.current + gesture.dx),
    }),
  ).current

  const thumbCenter = THUMB / 2 + sliderRatio(value, min, max) * Math.max(0, width - THUMB)

  return (
    <View
      {...pan.panHandlers}
      onLayout={(event) => {
        widthRef.current = event.nativeEvent.layout.width
        setWidth(event.nativeEvent.layout.width)
      }}
      accessible
      accessibilityRole='adjustable'
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        const direction = event.nativeEvent.actionName === 'increment' ? 1 : -1
        onChange(Math.min(max, Math.max(min, value + direction * step)))
      }}
      style={{ height: HIT_HEIGHT, justifyContent: 'center' }}
    >
      {/* children ignore touches, so the touch position is always relative to this view */}
      <View
        pointerEvents='none'
        style={{ height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2, backgroundColor: trackColor }}
      >
        <View
          style={{
            width: thumbCenter,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: fillColor,
          }}
        />
      </View>
      <View
        pointerEvents='none'
        style={{
          position: 'absolute',
          left: thumbCenter - THUMB / 2,
          width: THUMB,
          height: THUMB,
          borderRadius: THUMB / 2,
          backgroundColor: thumbColor,
        }}
      />
    </View>
  )
}
