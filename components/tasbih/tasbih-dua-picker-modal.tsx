import { SearchField } from '@/components/ui/search-field'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import { searchTasbihItems, type TasbihItem } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import type { RootState } from '@/redux/store'
import { Feather } from '@expo/vector-icons'
import { useEffect, useMemo, useState } from 'react'
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'

interface TasbihDuaPickerModalProps {
  visible: boolean
  selectedId: string
  onSelect: (item: TasbihItem) => void
  onClose: () => void
}

function DuaRow({ item, selected, onPress }: { item: TasbihItem; selected: boolean; onPress: () => void }) {
  const c = useTasbihColors()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        tw`flex-row items-center rounded-[14px] px-[16px] py-[12px] mb-[8px] border`,
        {
          backgroundColor: c.rowBg,
          borderColor: selected ? c.arc : c.rowBorder,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={tw`flex-1`}>
        <Text numberOfLines={2} style={[tw`font-nunito-semibold text-[15px]`, { color: c.text }]}>
          {item.transliteration}
        </Text>
        <Text numberOfLines={2} style={[tw`font-nunito text-[12px] mt-[2px]`, { color: c.translation }]}>
          {item.translation}
        </Text>
      </View>
      {selected && <Feather name='check' size={18} color={c.arc} style={tw`ml-[12px]`} />}
    </Pressable>
  )
}

/**
 * Bottom sheet to choose what to count. Shows the ~20 preset dhikr; typing searches the presets
 * and every dua the user has, whatever collection it is in.
 */
export function TasbihDuaPickerModal({
  visible,
  selectedId,
  onSelect,
  onClose,
}: TasbihDuaPickerModalProps) {
  const c = useTasbihColors()
  const duas = useSelector((s: RootState) => s.duas.items)
  const language = useSelector((s: RootState) => s.settings.language)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!visible) setQuery('')
  }, [visible])

  const items = useMemo(() => searchTasbihItems(query, duas, language), [query, duas, language])
  const searching = query.trim().length > 0

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[tw`flex-1 justify-end`, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
      >
        {/* tap the dimmed area to close */}
        <Pressable style={tw`flex-1`} onPress={onClose} accessibilityLabel='Close' />

        <View
          style={[
            tw`rounded-t-[24px] pt-[10px]`,
            { backgroundColor: c.sheetBg, height: '78%' },
          ]}
        >
          <View style={tw`self-center w-[40px] h-[4px] rounded-full mb-[14px]`}>
            <View style={[tw`flex-1 rounded-full`, { backgroundColor: c.rowBorder }]} />
          </View>

          <View style={tw`flex-row items-center justify-between px-[20px] mb-[14px]`}>
            <Text style={[tw`font-nunito-bold text-[18px]`, { color: c.text }]}>Choose a dua</Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel='Close'>
              <Feather name='x' size={22} color={c.text} />
            </Pressable>
          </View>

          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder='Search all duas'
            style={tw`mx-[16px] mb-[14px]`}
          />

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={tw`px-[16px] pb-[24px]`}
            ListHeaderComponent={
              <Text style={[tw`font-nunito-semibold text-[12px] mb-[10px]`, { color: c.translation }]}>
                {searching ? `${items.length} result${items.length === 1 ? '' : 's'}` : 'Popular dhikr'}
              </Text>
            }
            ListEmptyComponent={
              <Text style={[tw`font-nunito text-[14px] text-center mt-[24px]`, { color: c.translation }]}>
                No duas found
              </Text>
            }
            renderItem={({ item }) => (
              <DuaRow item={item} selected={item.id === selectedId} onPress={() => onSelect(item)} />
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
