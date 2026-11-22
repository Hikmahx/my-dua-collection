import { FormField } from '@/components/add-dua/form-field'
import { TasbihDuaLines } from '@/components/tasbih/tasbih-dua-lines'
import { PickRow } from '@/components/ui/pick-row'
import { SearchField } from '@/components/ui/search-field'
import { useAddDuaColors } from '@/hooks/use-add-dua-colors'
import { useSearch } from '@/hooks/use-search'
import { useT } from '@/hooks/use-t'
import { duaSearchFields } from '@/lib/dua-utils'
import { duaToTasbihItem } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import type { RootState } from '@/redux/store'
import { ScrollView, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

/** The list shows at most this many duas at a time; searching narrows it down. */
const MAX_ROWS = 30

interface ExistingDuaPickerProps {
  selectedIds: string[]
  onToggle: (id: string) => void
}

/** A searchable list of every dua in the app (pre-made and the user's own), to pick one or more. */
export function ExistingDuaPicker({ selectedIds, onToggle }: ExistingDuaPickerProps) {
  const c = useAddDuaColors()
  const t = useT()
  const duas = useSelector((state: RootState) => state.duas.items)
  const language = useSelector((state: RootState) => state.settings.translationLanguage)
  const { query, setQuery, results } = useSearch(duas, duaSearchFields)
  const visible = results.slice(0, MAX_ROWS)

  return (
    <FormField label={t('addDua.existingLabel')}>
      <SearchField value={query} onChangeText={setQuery} placeholder={t('tasbih.searchDuas')} style={tw`mb-3`} />

      {selectedIds.length > 0 && (
        <Text style={tw`text-xs mb-2 ${c.muted}`}>{t('addDua.selectedCount', { count: selectedIds.length })}</Text>
      )}

      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps='handled' style={{ maxHeight: 300 }}>
        {visible.map((dua) => (
          <PickRow key={dua.id} selected={selectedIds.includes(dua.id)} onPress={() => onToggle(dua.id)}>
            <TasbihDuaLines item={duaToTasbihItem(dua, language)} />
          </PickRow>
        ))}
        {visible.length === 0 && <Text style={tw`text-sm text-center py-4 ${c.muted}`}>{t('tasbih.noDuas')}</Text>}
        {results.length > visible.length && (
          <View style={tw`py-2`}>
            <Text style={tw`text-xs text-center ${c.muted}`}>{t('addDua.keepTyping')}</Text>
          </View>
        )}
      </ScrollView>
    </FormField>
  )
}
