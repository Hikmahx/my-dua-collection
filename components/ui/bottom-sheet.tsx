import { useT } from '@/hooks/use-t'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Animated, Keyboard, Modal, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  backgroundColor: string
  /** Color of the small grab handle at the top. */
  handleColor: string
  /** A fixed height instead of fitting the content (so a list inside can fill the space). It still rides above the keyboard. */
  height?: number
  /** Drawn in the Modal root under the backdrop and the sheet, e.g. a view placed off screen so it can be captured as a picture. */
  behind?: ReactNode
  children: ReactNode
}

const SLIDE_IN_MS = 240
const SLIDE_OUT_MS = 200

/** A panel that slides up from the bottom over a dimmed screen (and above the keyboard). Tap the dim area or back to close. */
export function BottomSheet({ visible, onClose, backgroundColor, handleColor, height: fixedHeight, behind, children }: BottomSheetProps) {
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const t = useT()

  // keep the Modal mounted while the sheet slides down
  const [mounted, setMounted] = useState(visible)
  // the sheet rides up with the keyboard so a text field inside it is never hidden
  const [keyboardHeight, setKeyboardHeight] = useState(0)
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

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const show = Keyboard.addListener(showEvent, (event) => setKeyboardHeight(event.endCoordinates.height))
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0))
    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  if (!mounted) return null

  return (
    <Modal visible transparent animationType='none' statusBarTranslucent onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        {behind}
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
            bottom: keyboardHeight,
            ...(fixedHeight
              ? { height: Math.min(fixedHeight, height * 0.92 - keyboardHeight) }
              : { maxHeight: height * 0.8 - keyboardHeight }),
            backgroundColor,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: (keyboardHeight > 0 ? 0 : insets.bottom) + 16,
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
