import { SearchField } from '@/components/ui/search-field'
import { useT } from '@/hooks/use-t'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View, type DimensionValue } from 'react-native'

interface PickerSheetProps {
  visible: boolean
  title: string
  onClose: () => void
  /** Adds a search box under the title. */
  search?: { value: string; onChangeText: (text: string) => void; placeholder: string }
  /** The sheet's height. 'auto' fits the content (a short list of options). */
  height?: DimensionValue
  /** The options, e.g. a FlatList of PickRow. */
  children: ReactNode
}

/**
 * The bottom sheet of the Tasbih "Choose a dua" picker, for any list of choices: a dimmed
 * backdrop (tap to close), a handle, a title with a close button, an optional search box and
 * the options.
 */
export function PickerSheet({ visible, title, onClose, search, height = '78%', children }: PickerSheetProps) {
  const c = useTasbihColors()
  const t = useT()

  return (
    <Modal visible={visible} transparent animationType='slide' statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[tw`flex-1 justify-end`, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
      >
        {/* tap the dimmed area to close */}
        <Pressable style={tw`flex-1`} onPress={onClose} accessibilityLabel={t('common.close')} />

        <View style={[tw`rounded-t-[24px] pt-[10px]`, { backgroundColor: c.sheetBg, height }]}>
          <View style={tw`self-center w-[40px] h-[4px] rounded-full mb-[14px]`}>
            <View style={[tw`flex-1 rounded-full`, { backgroundColor: c.rowBorder }]} />
          </View>

          <View style={tw`flex-row items-center justify-between px-[20px] mb-[14px]`}>
            <Text style={[tw`font-nunito-bold text-[18px]`, { color: c.text }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel={t('common.close')}>
              <Feather name='x' size={22} color={c.text} />
            </Pressable>
          </View>

          {search && (
            <SearchField
              value={search.value}
              onChangeText={search.onChangeText}
              placeholder={search.placeholder}
              style={tw`mx-[16px] mb-[14px]`}
            />
          )}

          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
