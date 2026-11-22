import { useT } from '@/hooks/use-t'
import { TasbihDuaLines } from '@/components/tasbih/tasbih-dua-lines'
import { PickRow } from '@/components/ui/pick-row'
import { PickerSheet } from '@/components/ui/picker-sheet'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import { useSearch } from '@/hooks/use-search'
import { duaSearchFields } from '@/lib/dua-utils'
import { duaToTasbihItem, getPresetItems, type TasbihItem } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import type { RootState } from '@/redux/store'
import { useEffect, useMemo } from 'react'
import { FlatList, Text } from 'react-native'
import { useSelector } from 'react-redux'

interface TasbihDuaPickerModalProps {
  visible: boolean
  selectedId: string
  onSelect: (item: TasbihItem) => void
  onClose: () => void
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
    <PickerSheet
      visible={visible}
      title={t('tasbih.chooseDua')}
      onClose={onClose}
      search={{ value: query, onChangeText: setQuery, placeholder: t('tasbih.searchDuas') }}
    >
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
          <PickRow selected={item.id === selectedId} onPress={() => onSelect(item)}>
            <TasbihDuaLines item={item} />
          </PickRow>
        )}
      />
    </PickerSheet>
  )
}
