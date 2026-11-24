import { useT } from '@/hooks/use-t'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import { themeColors } from '@/constants/theme-colors'
import { useEffect, useState, type ReactNode } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

interface DialogModalProps {
  visible: boolean
  title: string
  onClose: () => void
  /** The content. It scrolls when it is longer than the screen allows. */
  children: ReactNode
  /** Fixed under the content, e.g. a button. */
  footer?: ReactNode
}

/** Height of the fade at the bottom of a dialog that has more content to scroll to. */
const FADE_HEIGHT = 48

/**
 * A centered dialog with a title and a close button. Tap outside, the X or back to close. When the content is
 * taller than the dialog, it scrolls, and a fade with a small arrow at the bottom shows there is more below.
 */
export function DialogModal({ visible, title, onClose, children, footer }: DialogModalProps) {
  const isDark = useColorScheme() === 'dark'
  const t = useT()
  const { width, height } = useWindowDimensions()

  const [viewHeight, setViewHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const overflowing = contentHeight > viewHeight + 1
  const moreBelow = overflowing && scrollY + viewHeight < contentHeight - 8
  const cardColor = isDark ? themeColors.veryDarkBg : '#FFFFFF'

  // a dialog that is opened again starts at the top
  useEffect(() => {
    if (visible) setScrollY(0)
  }, [visible])

  return (
    <Modal visible={visible} transparent animationType='fade' statusBarTranslucent onRequestClose={onClose}>
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        {/* a sibling of the card, so scrolling inside the card still works */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t('common.close')} />

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
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel={t('common.close')}>
              <Feather name='x' size={22} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
            </Pressable>
          </View>

          <View style={tw`shrink`}>
            <ScrollView
              showsVerticalScrollIndicator={overflowing}
              onLayout={(event) => setViewHeight(event.nativeEvent.layout.height)}
              onContentSizeChange={(_, contentH) => setContentHeight(contentH)}
              onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
              scrollEventThrottle={16}
            >
              {children}
            </ScrollView>

            {moreBelow && (
              <View
                pointerEvents='none'
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: FADE_HEIGHT, justifyContent: 'flex-end', alignItems: 'center' }}
              >
                <Svg width='100%' height='100%' style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient id='dialogFade' x1='0' y1='0' x2='0' y2='1'>
                      <Stop offset='0' stopColor={cardColor} stopOpacity={0} />
                      <Stop offset='1' stopColor={cardColor} stopOpacity={1} />
                    </LinearGradient>
                  </Defs>
                  <Rect width='100%' height='100%' fill='url(#dialogFade)' />
                </Svg>
                <Feather name='chevron-down' size={20} color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'} />
              </View>
            )}
          </View>

          {footer && <View style={tw`mt-[20px]`}>{footer}</View>}
        </View>
      </View>
    </Modal>
  )
}
