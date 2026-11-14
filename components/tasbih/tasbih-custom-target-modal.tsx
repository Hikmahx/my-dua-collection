import { DialogButtons } from '@/components/ui/dialog-buttons'
import { MAX_TARGET } from '@/constants/tasbih-config'
import tw from '@/lib/tailwind'
import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, TextInput, View } from 'react-native'

interface TasbihCustomTargetModalProps {
  visible: boolean
  /** Pre-filled when the current target is already a custom one. */
  initialValue?: number
  onSubmit: (target: number) => void
  onCancel: () => void
}

/** Black screen with just a number field in the middle and Cancel / OK. */
export function TasbihCustomTargetModal({
  visible,
  initialValue,
  onSubmit,
  onCancel,
}: TasbihCustomTargetModalProps) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (visible) setText(initialValue ? String(initialValue) : '')
  }, [visible, initialValue])

  const value = Number(text)
  const valid = Number.isInteger(value) && value >= 1 && value <= MAX_TARGET

  const submit = () => {
    if (valid) onSubmit(value)
  }

  return (
    <Modal
      visible={visible}
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={tw`flex-1 bg-black items-center justify-center px-[40px]`}
      >
        <TextInput
          value={text}
          onChangeText={(t) => setText(t.replace(/[^0-9]/g, ''))}
          placeholder='Target'
          placeholderTextColor='#555555'
          keyboardType='number-pad'
          maxLength={String(MAX_TARGET).length}
          autoFocus
          selectionColor='#C4A866'
          onSubmitEditing={submit}
          accessibilityLabel='Custom target'
          style={tw`w-[220px] text-center font-nunito text-[48px] text-white py-[8px] mb-[32px] border-b-2 border-[#C4A866]`}
        />
        <View style={tw`w-full max-w-[300px]`}>
          <DialogButtons
            confirmLabel='OK'
            onCancel={onCancel}
            onConfirm={submit}
            confirmDisabled={!valid}
            forceDark
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
