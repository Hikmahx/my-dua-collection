import { useT } from '@/hooks/use-t'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Animated, Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  backgroundColor: string
  /** Color of the small grab handle at the top. */
  handleColor: string
  children: ReactNode
}

const SLIDE_IN_MS = 240
const SLIDE_OUT_MS = 200

/** A panel that slides up from the bottom over a dimmed screen. Tap the dim area or back to close. */
export function BottomSheet({ visible, onClose, backgroundColor, handleColor, children }: BottomSheetProps) {
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const t = useT()

  // keep the Modal mounted while the sheet slides down
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
          <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel={t('common.close')} />
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            maxHeight: height * 0.8,
            backgroundColor,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }) }],
          }}
        >
          <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 6 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: handleColor }} />
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  )
}
