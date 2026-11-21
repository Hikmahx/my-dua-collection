import { ExploreBackdrop } from '@/components/explore/explore-backdrop'
import { ArabicText } from '@/components/ui/arabic-text'
import { BackButton } from '@/components/ui/back-button'
import { RichText } from '@/components/ui/rich-text'
import { ScreenHeader } from '@/components/ui/screen-header'
import { exploreTheme } from '@/constants/explore-theme'
import type { ExploreTopic } from '@/constants/explore-topics'
import { Colors } from '@/constants/theme'
import type { ExploreArticle } from '@/data'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { useRouter } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'

interface ArticleScreenProps {
  topic: ExploreTopic
  article: ExploreArticle
}

/** One short article: the topic in the header, then the title (and the Arabic name for a Name of Allah) and the text. */
export function ArticleScreen({ topic, article }: ArticleScreenProps) {
  const isDark = useColorScheme() === 'dark'
  const c = exploreTheme[isDark ? 'dark' : 'light']
  const router = useRouter()

  return (
    <View style={{ flex: 1, backgroundColor: Colors[isDark ? 'dark' : 'light'].screenBody }}>
      <ScreenHeader
        title={topic.title ?? topic.label}
        bottomPadding={24}
        left={<BackButton onPress={() => router.back()} color={c.backIcon} />}
      />

      <ExploreBackdrop>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-[16px] pb-[32px]`}>
          <View
            style={[
              tw`rounded-[16px] px-[18px] py-[20px]`,
              { backgroundColor: c.card, borderWidth: 1, borderColor: c.gridLine },
            ]}
          >
            <Text style={[tw`font-berkshire text-[24px] leading-[32px]`, { color: c.rowTitle }]}>{article.title}</Text>

            {article.arabic && (
              <ArabicText size={44} color={c.arabic} style={tw`text-center mt-[12px]`}>
                {article.arabic}
              </ArabicText>
            )}

            {article.meaning && (
              <Text style={[tw`font-nunito-semibold text-[14px] text-center mt-[4px]`, { color: c.rowPreview }]}>
                {article.meaning}
              </Text>
            )}

            <View style={{ height: 1, backgroundColor: c.gridLine, marginVertical: 16 }} />

            <RichText html={article.body} color={c.bodyText} size={15} />
          </View>
        </ScrollView>
      </ExploreBackdrop>
    </View>
  )
}
