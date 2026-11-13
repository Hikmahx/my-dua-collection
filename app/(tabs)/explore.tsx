import ExploreIcon from '@/components/icons/explore-icon'
import { ExploreCard } from '@/components/ui/explore-card'
import { ExploreCardsBackground } from '@/components/ui/explore-cards-background'
import { FilterMenu } from '@/components/ui/filter-menu'
import { EXPLORE_TOPICS } from '@/constants/explore-topics'
import { exploreTheme } from '@/constants/explore-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import type { FilterMenuAnchor, FilterMenuSection } from '@/lib/types'
import { setTheme } from '@/redux/reducers/settingsSlice'
import { RootState } from '@/redux/store'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'

const COLUMNS = 3
const HEADER_SIDE_MARGIN = 30
const SEARCH_SIDE_MARGIN = 16
const ROWS = 3 // the grid is always at least 3 rows so it fills the screen
const MIN_ROW_HEIGHT = 130 // rows never get shorter than this (the screen scrolls instead)

export default function ExploreScreen() {
  const isDark = useColorScheme() === 'dark'
  const c = exploreTheme[isDark ? 'dark' : 'light']

  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.settings.theme)

  const [query, setQuery] = useState('')

  // Header filter menu (same Appearance menu as Home)
  const filterButtonRef = useRef<View>(null)
  const [menuAnchor, setMenuAnchor] = useState<FilterMenuAnchor | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const openMenu = useCallback(() => {
    filterButtonRef.current?.measureInWindow((x, y, w, h) => {
      setMenuAnchor({ x, y, width: w, height: h })
      setMenuOpen(true)
    })
  }, [])

  const menuSections: FilterMenuSection[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      options: [
        {
          id: 'dark',
          label: 'Dark',
          icon: 'weather-night',
          selected: theme === 'dark',
          onSelect: () => dispatch(setTheme('dark')),
        },
        {
          id: 'light',
          label: 'Light',
          icon: 'white-balance-sunny',
          selected: theme === 'light',
          onSelect: () => dispatch(setTheme('light')),
        },
      ],
    },
  ]

  // Search filters the grid; the shade alternation restarts from the first visible cell
  const topics = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? EXPLORE_TOPICS.filter((t) => t.label.toLowerCase().includes(q)) : EXPLORE_TOPICS
  }, [query])

  // Always show at least 3 rows (padded with empty cells) so the grid lines and the
  // background still fill the screen while searching.
  const rows = Math.max(ROWS, Math.ceil(topics.length / COLUMNS))
  const slots = Array.from({ length: rows * COLUMNS }, (_, i) => topics[i] ?? null)

  return (
    <SafeAreaView
      edges={['top']}
      style={tw`flex-1 ${isDark ? 'bg-deep-bg' : 'bg-light-bg'}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View
          style={[
            tw`flex-row items-center justify-between min-h-[30px] mb-[16px]`,
            { paddingHorizontal: HEADER_SIDE_MARGIN },
          ]}
        >
          <Text style={[tw`font-nunito-extrabold text-[21px]`, { color: c.title }]}>
            Explore
          </Text>
          <Pressable
            ref={filterButtonRef}
            hitSlop={12}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            onPress={openMenu}
          >
            <MaterialCommunityIcons name='tune-variant' size={26} color={c.filterIcon} />
          </Pressable>
        </View>

        {/* Search (sits on a full-width band in light mode) */}
        <View style={{ backgroundColor: c.searchBand, paddingTop: 18, paddingBottom: 20 }}>
          <View
            style={[
              tw`flex-row items-center h-[46px] rounded-[12px] px-[16px]`,
              {
                marginHorizontal: SEARCH_SIDE_MARGIN,
                backgroundColor: c.searchBg,
                borderWidth: 1,
                borderColor: c.searchBorder,
              },
            ]}
          >
            <ExploreIcon color={c.searchIcon} size={16} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder='Search topics'
              placeholderTextColor={c.searchPlaceholder}
              returnKeyType='search'
              autoCorrect={false}
              style={[
                tw`flex-1 font-nunito text-[14px] ml-[12px] p-0`,
                { color: c.searchText },
              ]}
            />
            {query.length > 0 && (
              <Pressable hitSlop={10} onPress={() => setQuery('')}>
                <Feather name='x' size={16} color={c.searchPlaceholder} />
              </Pressable>
            )}
          </View>
        </View>

        {/* 3x3 grid: takes all the height between the search bar and the tab bar (flex: 1),
            each row at least MIN_ROW_HEIGHT. Background behind, translucent cells on top. */}
        <View
          style={{
            flex: 1,
            borderTopWidth: 1,
            borderColor: c.gridLine,
            overflow: 'hidden',
          }}
        >
          <View
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            pointerEvents='none'
          >
            <ExploreCardsBackground isDark={isDark} />
          </View>

          {Array.from({ length: rows }, (_, r) => (
            <View key={r} style={{ flex: 1, minHeight: MIN_ROW_HEIGHT, flexDirection: 'row' }}>
              {slots.slice(r * COLUMNS, r * COLUMNS + COLUMNS).map((topic, col) => {
                const i = r * COLUMNS + col
                return (
                  <ExploreCard
                    key={topic?.id ?? `empty-${i}`}
                    label={topic?.label}
                    iconKey={topic?.iconKey}
                    index={i}
                    columns={COLUMNS}
                    isLastRow={r === rows - 1}
                    onPress={() => {
                      // TODO: navigate to the topic screen, e.g. router.push(`/explore/${topic.id}`)
                    }}
                  />
                )
              })}
            </View>
          ))}

          {topics.length === 0 && (
            <View
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}
              pointerEvents='none'
            >
              <Text
                style={tw`font-nunito ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
              >
                No topics found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <FilterMenu
        visible={menuOpen}
        anchor={menuAnchor}
        sections={menuSections}
        onClose={() => setMenuOpen(false)}
      />
    </SafeAreaView>
  )
}
