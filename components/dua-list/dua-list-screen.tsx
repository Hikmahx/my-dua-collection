import { useT } from '@/hooks/use-t'
import ExploreIcon from '@/components/icons/explore-icon'
import { DuaListRow } from '@/components/dua-list/dua-list-row'
import { AppearanceMenuButton } from '@/components/ui/appearance-menu-button'
import { BackButton } from '@/components/ui/back-button'
import { ReorderableList } from '@/components/ui/reorderable-list'
import { ScreenHeader } from '@/components/ui/screen-header'
import { SearchField } from '@/components/ui/search-field'
import { DUA_ROW_GAP } from '@/constants/dua-config'
import { useDuaListColors } from '@/hooks/use-dua-list-colors'
import { useSearch } from '@/hooks/use-search'
import { useSourceFilter } from '@/hooks/use-source-filter'
import { duaSourceSearchFields } from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import type { FilterMenuOption, FilterMenuSection } from '@/lib/types'
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
  /** Actions for the top of the header dropdown (the collection screen: Add, Edit). */
  menuActions?: FilterMenuOption[]
  /** Sections for the bottom of the header dropdown, below Appearance (the collection screen: Export). */
  footerSections?: FilterMenuSection[]
  /**
   * Makes the list reorderable (Favorites). The dropdown gets "Reorder", which shows a grip on every
   * row; each drag calls this with the new order of ids, and "Done" goes back to the normal list.
   * `duas` must already be in the order to show.
   */
  onReorder?: (ids: string[]) => void
}

const ItemSeparator = () => <View style={{ height: DUA_ROW_GAP }} />

/**
 * A screen listing duas: header (back arrow, title, "N duas", search and the filter menu with
 * the Surah / Hadith filters), optional search box, and the numbered rows. Search also finds
 * duas by surah and hadith name. Used for a collection's duas and for Favorites. While reordering,
 * the rows get a grip, and search and the filters are put aside so the whole list can be arranged.
 */
export function DuaListScreen({
  title,
  listId,
  duas,
  onBack,
  showCollections = false,
  emptyMessage,
  menuActions,
  footerSections,
  onReorder,
}: DuaListScreenProps) {
  const c = useDuaListColors()
  const router = useRouter()
  const t = useT()
  const [searchOpen, setSearchOpen] = useState(false)
  const [reordering, setReordering] = useState(false)
  const { filter, filtered, sections } = useSourceFilter(duas)
  const { query, setQuery, results, isSearching } = useSearch(filtered, duaSourceSearchFields)

  const toggleSearch = () => {
    if (searchOpen) setQuery('')
    setSearchOpen(!searchOpen)
  }

  const startReordering = () => {
    setQuery('')
    setSearchOpen(false)
    setReordering(true)
  }

  // "Reorder" sits above the filters in the dropdown; with fewer than two duas there is nothing to arrange
  const reorderAction: FilterMenuOption | null = onReorder
    ? { id: 'reorder', label: t('list.reorder'), icon: 'swap-vertical', onSelect: startReordering }
    : null
  const actions: FilterMenuOption[] = [...(menuActions ?? []), ...(reorderAction ? [reorderAction] : [])]
  const count = reordering ? duas.length : filtered.length

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader
        title={title}
        subtitle={`${t('list.duaCount', { count })}${reordering ? ` · ${t('list.reordering')}` : filter ? ` · ${filter.name}` : ''}`}
        bottomPadding={7}
        left={onBack && <BackButton onPress={onBack} color={c.icon} />}
        right={
          reordering ? (
            <Pressable
              onPress={() => setReordering(false)}
              hitSlop={12}
              accessibilityRole='button'
              accessibilityLabel={t('list.doneReordering')}
            >
              <Text style={[tw`font-nunito-semibold text-[13px]`, { color: c.accent }]}>{t('common.done')}</Text>
            </Pressable>
          ) : (
            <View style={tw`flex-row items-center`}>
              <Pressable
                onPress={toggleSearch}
                hitSlop={12}
                accessibilityRole='button'
                accessibilityLabel={searchOpen ? t('list.closeSearch') : t('common.search')}
              >
                {searchOpen ? (
                  <Feather name='x' size={22} color={c.icon} />
                ) : (
                  <ExploreIcon color={c.icon} size={20} />
                )}
              </Pressable>
              <View style={tw`ml-[18px]`}>
                <AppearanceMenuButton
                  extraSections={
                    actions.length > 0 ? [{ id: 'manage', title: t('list.manage'), options: actions }, ...sections] : sections
                  }
                  trailingSections={footerSections}
                  active={!!filter}
                />
              </View>
            </View>
          )
        }
      />

      {reordering ? (
        <>
          <Text style={[tw`font-nunito text-[11px] leading-[14px] mx-[16px] mt-[12px]`, { color: c.muted }]}>
            {t('list.reorderHint')}
          </Text>
          <View style={tw`flex-1 mt-[12px]`}>
            <ReorderableList
              items={duas}
              onReorder={(ids) => onReorder?.(ids)}
              getLabel={(dua) => dua.title}
              handleColor={c.subtitle}
              emptyMessage={emptyMessage}
              emptyColor={c.muted}
              renderRow={(dua, index, handle) => (
                <DuaListRow dua={dua} index={index} fixedHeight trailing={handle} />
              )}
            />
          </View>
        </>
      ) : (
        <>
          {searchOpen && (
            <SearchField
              value={query}
              onChangeText={setQuery}
              placeholder={t('list.searchPlaceholder')}
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
                    // swipes through those duas in this order and counts them in its "4/11" pill
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
        </>
      )}
    </View>
  )
}
