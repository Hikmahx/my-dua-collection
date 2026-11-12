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
  useWindowDimensions,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'

const COLUMNS = 3
const HEADER_SIDE_MARGIN = 30
const SEARCH_SIDE_MARGIN = 16

export default function ExploreScreen() {
  const isDark = useColorScheme() === 'dark'
  const c = exploreTheme[isDark ? 'dark' : 'light']
  const { width } = useWindowDimensions()

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

  // Pad to full rows so the grid lines and background still look complete
  const rows = Math.max(1, Math.ceil(topics.length / COLUMNS))
  const slots = Array.from({ length: rows * COLUMNS }, (_, i) => topics[i] ?? null)

  // Design: 125 x 145 cells on a 375pt phone. Scale with width, clamped for tablets.
  const cellHeight = Math.min(Math.max(Math.round((width / COLUMNS) * 1.16), 140), 200)

  return (
    <SafeAreaView
      edges={['top']}
      style={tw`flex-1 ${isDark ? 'bg-deep-bg' : 'bg-light-bg'}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View
          style={[
            tw`flex-row items-center justify-between min-h-[30px] mb-[24px]`,
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

        {/* Search */}
        <View
          style={[
            tw`flex-row items-center h-[46px] rounded-[12px] px-[16px] mb-[20px]`,
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

        {/* 3x3 grid: low-poly background behind, alternating translucent cells on top */}
        <View
          style={{
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

          <View style={tw`flex-row flex-wrap`}>
            {slots.map((topic, i) => (
              <ExploreCard
                key={topic?.id ?? `empty-${i}`}
                label={topic?.label}
                iconKey={topic?.iconKey}
                index={i}
                columns={COLUMNS}
                isLastRow={Math.floor(i / COLUMNS) === rows - 1}
                height={cellHeight}
                onPress={() => {
                  // TODO: navigate to the topic screen, e.g. router.push(`/explore/${topic.id}`)
                }}
              />
            ))}
          </View>
        </View>

        {topics.length === 0 && (
          <Text
            style={tw`text-center font-nunito mt-6 ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
          >
            No topics found
          </Text>
        )}
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
