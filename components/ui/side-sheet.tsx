import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Animated, Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SideSheetProps {
  visible: boolean
  onClose: () => void
  backgroundColor: string
  children: ReactNode
}

const SLIDE_IN_MS = 240
const SLIDE_OUT_MS = 200

/** A panel that slides in from the right edge over a dimmed screen. Tap the dim area or back to close. */
export function SideSheet({ visible, onClose, backgroundColor, children }: SideSheetProps) {
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const panelWidth = Math.min(width * 0.85, 380)

  // keep the Modal mounted while the panel slides out
  const [mounted, setMounted] = useState(visible)
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current

  useEffect(() => {
    if (visible) {
      setMounted(true)
      Animated.timing(progress, { toValue: 1, duration: SLIDE_IN_MS, useNativeDriver: true }).start()
    } else {
      Animated.timing(progress, { toValue: 0, duration: SLIDE_OUT_MS, useNativeDriver: true }).start(
        ({ finished }) => {
          if (finished) setMounted(false)
        },
      )
    }
  }, [visible, progress])

  if (!mounted) return null

  return (
    <Modal visible transparent animationType='none' statusBarTranslucent onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.55)', opacity: progress }]}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel='Close' />
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: panelWidth,
            backgroundColor,
            transform: [
              { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [panelWidth, 0] }) },
            ],
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  )
}
