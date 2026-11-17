import { useDuaScreenColors } from '@/hooks/use-dua-screen-colors'
import { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'

const HEIGHT = 4

/** The thin bar under the header: how far through the list you are (current dua / total). */
export function DuaProgressBar({ progress }: { progress: number }) {
  const c = useDuaScreenColors()
  const value = useRef(new Animated.Value(progress)).current

  useEffect(() => {
    Animated.timing(value, { toValue: progress, duration: 220, useNativeDriver: false }).start()
  }, [progress, value])

  return (
    <View style={{ height: HEIGHT, backgroundColor: c.track }}>
      <Animated.View
        style={{
          height: HEIGHT,
          backgroundColor: c.accent,
          width: value.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  )
}
