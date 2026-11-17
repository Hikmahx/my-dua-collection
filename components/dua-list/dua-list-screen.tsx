import ExploreIcon from '@/components/icons/explore-icon'
import { DuaListRow } from '@/components/dua-list/dua-list-row'
import { AppearanceMenuButton } from '@/components/ui/appearance-menu-button'
import { BackButton } from '@/components/ui/back-button'
import { ScreenHeader } from '@/components/ui/screen-header'
import { SearchField } from '@/components/ui/search-field'
import { useDuaListColors } from '@/hooks/use-dua-list-colors'
import { useSearch } from '@/hooks/use-search'
import { useSourceFilter } from '@/hooks/use-source-filter'
import { duaSourceSearchFields } from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import type { Dua } from '@/redux/reducers/duasSlice'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'

interface DuaListScreenProps {
  title: string
  /** Which list this is: a collection id, or FAVORITES_LIST_ID. The Dua screen swipes through it. */
  listId: string
  duas: Dua[]
  /** Shows a back arrow in the header when given (the collection screen). */
  onBack?: () => void
  /** Favorites: show the collections each dua belongs to. */
  showCollections?: boolean
  /** Shown when the list is empty. */
  emptyMessage: string
}

const ItemSeparator = () => <View style={tw`h-[6px]`} />

/**
 * A screen listing duas: header (back arrow, title, "N duas", search and the filter menu with
 * the Surah / Hadith filters), optional search box, and the numbered rows. Search also finds
 * duas by surah and hadith name. Used for a collection's duas and for Favorites.
 */
export function DuaListScreen({
  title,
  listId,
  duas,
  onBack,
  showCollections = false,
  emptyMessage,
}: DuaListScreenProps) {
  const c = useDuaListColors()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const { filter, filtered, sections } = useSourceFilter(duas)
  const { query, setQuery, results, isSearching } = useSearch(filtered, duaSourceSearchFields)

  const toggleSearch = () => {
    if (searchOpen) setQuery('')
    setSearchOpen(!searchOpen)
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader
        title={title}
        subtitle={`${filtered.length} ${filtered.length === 1 ? 'dua' : 'duas'}${filter ? ` · ${filter.name}` : ''}`}
        bottomPadding={7}
        left={onBack && <BackButton onPress={onBack} color={c.icon} />}
        right={
          <View style={tw`flex-row items-center`}>
            <Pressable
              onPress={toggleSearch}
              hitSlop={12}
              accessibilityRole='button'
              accessibilityLabel={searchOpen ? 'Close search' : 'Search'}
            >
              {searchOpen ? (
                <Feather name='x' size={22} color={c.icon} />
              ) : (
                <ExploreIcon color={c.icon} size={20} />
              )}
            </Pressable>
            <View style={tw`ml-[18px]`}>
              <AppearanceMenuButton extraSections={sections} active={!!filter} />
            </View>
          </View>
        }
      />

      {searchOpen && (
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder='Search duas, surah or hadith'
          autoFocus
          style={tw`mx-[16px] mt-[12px]`}
        />
      )}

      <FlatList
        data={results}
        keyExtractor={(dua) => dua.id}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={tw`px-[16px] pt-[12px] pb-[24px]`}
        renderItem={({ item, index }) => (
          <DuaListRow
            dua={item}
            index={index}
            showCollections={showCollections}
            onPress={() =>
              router.push({
                pathname: '/dua/[id]',
                // `ids` = the list exactly as shown (after any filter or search), so the Dua screen
                // swipes through those duas and counts them in its "4/11" pill
                params: { id: item.id, list: listId, ids: results.map((dua) => dua.id).join(',') },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={[tw`font-nunito text-[14px] text-center mt-[32px]`, { color: c.muted }]}>
            {isSearching ? 'No duas found' : emptyMessage}
          </Text>
        }
      />
    </View>
  )
}
