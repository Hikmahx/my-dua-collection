import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'

interface DialogModalProps {
  visible: boolean
  title: string
  onClose: () => void
  /** The content. It scrolls when it is longer than the screen allows. */
  children: ReactNode
  /** Fixed under the content, e.g. a button. */
  footer?: ReactNode
}

/** A centered dialog with a title and a close button. Tap outside, the X or back to close. */
export function DialogModal({ visible, title, onClose, children, footer }: DialogModalProps) {
  const isDark = useColorScheme() === 'dark'
  const { width, height } = useWindowDimensions()

  return (
    <Modal visible={visible} transparent animationType='fade' statusBarTranslucent onRequestClose={onClose}>
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        {/* a sibling of the card, so scrolling inside the card still works */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel='Close' />

        <View
          style={[
            tw`rounded-[20px] p-[22px] border ${
              isDark ? 'bg-very-dark-bg border-white/10' : 'bg-white border-black/5'
            }`,
            { width: Math.min(width - 48, 400), maxHeight: height * 0.8 },
          ]}
        >
          <View style={tw`flex-row items-start justify-between mb-[14px]`}>
            <Text
              style={tw`flex-1 font-nunito-bold text-[17px] mr-[12px] ${
                isDark ? 'text-white' : 'text-dark-text'
              }`}
            >
              {title}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel='Close'>
              <Feather name='x' size={22} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
            </Pressable>
          </View>

          <ScrollView style={tw`shrink`} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>

          {footer && <View style={tw`mt-[20px]`}>{footer}</View>}
        </View>
      </View>
    </Modal>
  )
}
