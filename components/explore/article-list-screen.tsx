import { ArticleRow } from '@/components/explore/article-row'
import { ExploreBackdrop } from '@/components/explore/explore-backdrop'
import { BackButton } from '@/components/ui/back-button'
import { ScreenHeader } from '@/components/ui/screen-header'
import { SearchField } from '@/components/ui/search-field'
import { exploreTheme } from '@/constants/explore-theme'
import type { ExploreTopic } from '@/constants/explore-topics'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useSearch } from '@/hooks/use-search'
import { useT } from '@/hooks/use-t'
import { articleSearchFields, getArticlesOfTopic } from '@/lib/explore-utils'
import tw from '@/lib/tailwind'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { FlatList, Text, View } from 'react-native'

/**
 * A topic's list: back arrow, title, search box and one row per article. The Names of Allah use
 * the same screen; their rows show the Arabic name instead of a chevron (see ArticleRow).
 */
export function ArticleListScreen({ topic }: { topic: ExploreTopic }) {
  const isDark = useColorScheme() === 'dark'
  const c = exploreTheme[isDark ? 'dark' : 'light']
  const router = useRouter()
  const t = useT()
  const articles = useMemo(() => getArticlesOfTopic(topic.id), [topic.id])
  const { query, setQuery, results } = useSearch(articles, articleSearchFields)

  return (
    <View style={{ flex: 1, backgroundColor: Colors[isDark ? 'dark' : 'light'].screenBody }}>
      <ScreenHeader
        title={topic.title ?? topic.label}
        bottomPadding={24}
        left={<BackButton onPress={() => router.back()} color={c.backIcon} />}
      />

      <ExploreBackdrop>
        <View style={{ backgroundColor: c.searchBand, paddingTop: 17, paddingBottom: 21 }}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder={topic.searchPlaceholder ?? t('common.search')}
            style={{ marginHorizontal: 16 }}
          />
        </View>

        <FlatList
          data={results}
          keyExtractor={(article) => article.id}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          style={{ borderTopWidth: 1, borderColor: c.gridLine }}
          renderItem={({ item }) => (
            <ArticleRow
              article={item}
              onPress={() =>
                router.push({
                  pathname: '/explore/[topic]/[article]',
                  params: { topic: topic.id, article: item.id },
                })
              }
            />
          )}
          ListEmptyComponent={
            <Text style={[tw`font-nunito text-[14px] text-center mt-[32px]`, { color: c.rowPreview }]}>
              {t('explore.noResults')}
            </Text>
          }
        />
      </ExploreBackdrop>
    </View>
  )
}
