import { useT } from '@/hooks/use-t'
import { TasbihDuaLines } from '@/components/tasbih/tasbih-dua-lines'
import { SearchField } from '@/components/ui/search-field'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import { useSearch } from '@/hooks/use-search'
import { duaSearchFields } from '@/lib/dua-utils'
import { duaToTasbihItem, getPresetItems, type TasbihItem } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import type { RootState } from '@/redux/store'
import { Feather } from '@expo/vector-icons'
import { useEffect, useMemo } from 'react'
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
        tw`flex-row items-center rounded-[14px] px-[16px] py-[10px] mb-[8px] border`,
        {
          backgroundColor: c.rowBg,
          borderColor: selected ? c.arc : c.rowBorder,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={tw`flex-1`}>
        <TasbihDuaLines item={item} />
      </View>
      {selected && <Feather name='check' size={18} color={c.arc} style={tw`ml-[12px]`} />}
    </Pressable>
  )
}

/**
 * Bottom sheet to choose what to count. Shows the 10 preset duas (TASBIH_PRESET_IDS); typing searches
 * every dua in dua.json, whatever collection it is in.
 */
export function TasbihDuaPickerModal({
  visible,
  selectedId,
  onSelect,
  onClose,
}: TasbihDuaPickerModalProps) {
  const c = useTasbihColors()
  const duas = useSelector((s: RootState) => s.duas.items)
  const language = useSelector((s: RootState) => s.settings.translationLanguage)
  const t = useT()
  const { query, setQuery, results, isSearching } = useSearch(duas, duaSearchFields)

  useEffect(() => {
    if (!visible) setQuery('')
  }, [visible, setQuery])

  // Empty search box: the preset duas. Typing: every dua in the app, whatever its collection.
  const items = useMemo(
    () =>
      isSearching
        ? results.map((dua) => duaToTasbihItem(dua, language))
        : getPresetItems(duas, language),
    [isSearching, results, duas, language],
  )

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
        <Pressable style={tw`flex-1`} onPress={onClose} accessibilityLabel={t('common.close')} />

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
            <Text style={[tw`font-nunito-bold text-[18px]`, { color: c.text }]}>{t('tasbih.chooseDua')}</Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel={t('common.close')}>
              <Feather name='x' size={22} color={c.text} />
            </Pressable>
          </View>

          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder={t('tasbih.searchDuas')}
            style={tw`mx-[16px] mb-[14px]`}
          />

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={tw`px-[16px] pb-[24px]`}
            ListEmptyComponent={
              <Text style={[tw`font-nunito text-[14px] text-center mt-[24px]`, { color: c.translation }]}>
                {t('tasbih.noDuas')}
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
