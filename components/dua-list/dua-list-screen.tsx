import ExploreIcon from '@/components/icons/explore-icon'
import { DuaListRow } from '@/components/dua-list/dua-list-row'
import { ScreenHeader } from '@/components/ui/screen-header'
import { SearchField } from '@/components/ui/search-field'
import { useDuaListColors } from '@/hooks/use-dua-list-colors'
import { useSearch } from '@/hooks/use-search'
import { duaSearchFields } from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import type { Dua } from '@/redux/reducers/duasSlice'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'

interface DuaListScreenProps {
  title: string
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
 * A screen listing duas: header (back arrow, title, "N duas", search), optional search box,
 * and the numbered rows. Used for a collection's duas and for Favorites.
 */
export function DuaListScreen({
  title,
  duas,
  onBack,
  showCollections = false,
  emptyMessage,
}: DuaListScreenProps) {
  const c = useDuaListColors()
  const [searchOpen, setSearchOpen] = useState(false)
  const { query, setQuery, results, isSearching } = useSearch(duas, duaSearchFields)

  const toggleSearch = () => {
    if (searchOpen) setQuery('')
    setSearchOpen(!searchOpen)
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader
        title={title}
        subtitle={`${duas.length} ${duas.length === 1 ? 'dua' : 'duas'}`}
        bottomPadding={7}
        left={
          onBack && (
            <Pressable onPress={onBack} hitSlop={12} accessibilityRole='button' accessibilityLabel='Back'>
              <Feather name='arrow-left' size={24} color={c.icon} />
            </Pressable>
          )
        }
        right={
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
        }
      />

      {searchOpen && (
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder='Search duas'
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
            onPress={() => {
              // TODO: open the dua, e.g. router.push(`/dua/${item.id}`)
            }}
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
