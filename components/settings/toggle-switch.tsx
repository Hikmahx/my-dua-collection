import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useEffect, useRef } from 'react'
import { Animated, Pressable } from 'react-native'

const TRACK_WIDTH = 44
const TRACK_HEIGHT = 26
const THUMB = 20
const PADDING = (TRACK_HEIGHT - THUMB) / 2

interface ToggleSwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  accessibilityLabel: string
}

/** The pill toggle from the Settings design (the native Switch can't be styled like it). */
export function ToggleSwitch({ value, onValueChange, accessibilityLabel }: ToggleSwitchProps) {
  const c = useSettingsColors()
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(progress, { toValue: value ? 1 : 0, duration: 160, useNativeDriver: false }).start()
  }, [value, progress])

  const mix = (from: string, to: string) => progress.interpolate({ inputRange: [0, 1], outputRange: [from, to] })

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      accessibilityRole='switch'
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          justifyContent: 'center',
          backgroundColor: mix(c.toggleOff, c.toggleOn),
        }}
      >
        <Animated.View
          style={{
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            backgroundColor: mix(c.toggleThumbOff, c.toggleThumbOn),
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [PADDING, TRACK_WIDTH - THUMB - PADDING],
                }),
              },
            ],
          }}
        />
      </Animated.View>
    </Pressable>
  )
}
