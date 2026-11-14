import { DialogButtons } from '@/components/ui/dialog-buttons'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import type { ReactNode } from 'react'
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native'

interface ConfirmModalProps {
  visible: boolean
  title: string
  message: string
  /** Optional content shown between the message and the buttons. */
  children?: ReactNode
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/** Centered "are you sure?" dialog. Tapping outside or the back button cancels. */
export function ConfirmModal({
  visible,
  title,
  message,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const isDark = useColorScheme() === 'dark'
  const { width } = useWindowDimensions()

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable
        style={[tw`flex-1 items-center justify-center`, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
        onPress={onCancel}
      >
        <View
          // swallow touches so tapping the card itself doesn't dismiss it
          onStartShouldSetResponder={() => true}
          style={[
            tw`rounded-[20px] p-[22px] border ${
              isDark ? 'bg-very-dark-bg border-white/10' : 'bg-white border-black/5'
            }`,
            { width: Math.min(width - 64, 340) },
          ]}
        >
          <Text
            style={tw`font-nunito-bold text-[17px] mb-[8px] ${isDark ? 'text-white' : 'text-dark-text'}`}
          >
            {title}
          </Text>
          <Text
            style={tw`font-nunito text-[14px] leading-[20px] mb-[20px] ${
              isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'
            }`}
          >
            {message}
          </Text>
          {children && <View style={tw`mb-[20px] -mt-[8px]`}>{children}</View>}
          <DialogButtons
            cancelLabel={cancelLabel}
            confirmLabel={confirmLabel}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        </View>
      </Pressable>
    </Modal>
  )
}
