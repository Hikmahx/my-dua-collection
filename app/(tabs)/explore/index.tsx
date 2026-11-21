import { useT } from '@/hooks/use-t'
import { ExploreCard } from '@/components/ui/explore-card'
import { ExploreCardsBackground } from '@/components/ui/explore-cards-background'
import { ScreenHeader } from '@/components/ui/screen-header'
import { SearchField } from '@/components/ui/search-field'
import { exploreTheme } from '@/constants/explore-theme'
import { EXPLORE_TOPICS, type ExploreTopic } from '@/constants/explore-topics'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useSearch } from '@/hooks/use-search'
import tw from '@/lib/tailwind'
import { useRouter } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'

const topicSearchFields = (topic: ExploreTopic) => [topic.label]

const COLUMNS = 3
const ROWS = 3 // the grid is always at least 3 rows so it fills the screen
const MIN_ROW_HEIGHT = 130 // rows never get shorter than this (the screen scrolls instead)

export default function ExploreScreen() {
  const isDark = useColorScheme() === 'dark'
  const t = useT()
  const router = useRouter()
  const c = exploreTheme[isDark ? 'dark' : 'light']
  const { query, setQuery, results: topics } = useSearch(EXPLORE_TOPICS, topicSearchFields)

  // Always show at least 3 rows (padded with empty cells) so the grid lines and the
  // background still fill the screen while searching.
  const rows = Math.max(ROWS, Math.ceil(topics.length / COLUMNS))
  const slots = Array.from({ length: rows * COLUMNS }, (_, i) => topics[i] ?? null)

  return (
    <View style={{ flex: 1, backgroundColor: Colors[isDark ? 'dark' : 'light'].screenBody }}>
      <ScreenHeader title={t('tabs.explore')} bottomPadding={24} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Search (sits on a full-width band in light mode) */}
        <View style={{ backgroundColor: c.searchBand, paddingTop: 17, paddingBottom: 21 }}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder={t('explore.searchTopics')}
            style={{ marginHorizontal: 16 }}
          />
        </View>

        {/* 3x3 grid: takes all the height between the search bar and the tab bar (flex: 1),
            each row at least MIN_ROW_HEIGHT. Background behind, translucent cells on top. */}
        <View style={{ flex: 1, borderTopWidth: 1, borderColor: c.gridLine, overflow: 'hidden' }}>
          <View style={tw`absolute top-0 left-0 right-0 bottom-0`} pointerEvents='none'>
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
                      if (!topic) return
                      if (topic.kind === 'chat') router.push('/explore/ask-duaai')
                      else router.push({ pathname: '/explore/[topic]', params: { topic: topic.id } })
                    }}
                  />
                )
              })}
            </View>
          ))}

          {topics.length === 0 && (
            <View
              style={tw`absolute top-0 left-0 right-0 bottom-0 items-center justify-center`}
              pointerEvents='none'
            >
              <Text
                style={tw`font-nunito ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
              >
                {t('explore.noTopics')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
