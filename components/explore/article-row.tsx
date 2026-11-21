import { ArabicText } from '@/components/ui/arabic-text'
import { exploreTheme } from '@/constants/explore-theme'
import type { ExploreArticle } from '@/data'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { getArticlePreview } from '@/lib/explore-utils'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'

interface ArticleRowProps {
  article: ExploreArticle
  onPress: () => void
}

/**
 * One row of a topic list: title, a one-line preview, and on the right either the Arabic name
 * (Names of Allah) or a chevron (every other topic).
 */
export function ArticleRow({ article, onPress }: ArticleRowProps) {
  const c = exploreTheme[useColorScheme() === 'dark' ? 'dark' : 'light']

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={article.title}
      style={({ pressed }) => [
        tw`flex-row items-center px-[16px] py-[10px]`,
        { minHeight: 50, borderBottomWidth: 1, borderColor: c.gridLine, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={tw`flex-1`}>
        <Text numberOfLines={1} style={[tw`font-berkshire text-[16px] leading-[22px] mb-2`, { color: c.rowTitle }]}>
          {article.title}
        </Text>
        <Text numberOfLines={1} style={[tw`font-nunito text-[10px] leading-[14px]`, { color: c.rowPreview }]}>
          {getArticlePreview(article)}
        </Text>
      </View>

      {article.arabic ? (
        <ArabicText size={26} color={c.arabic} numberOfLines={1} style={tw`ml-[12px]`}>
          {article.arabic}
        </ArabicText>
      ) : (
        <Feather name='chevron-right' size={18} color={c.chevron} style={tw`ml-[8px]`} />
      )}
    </Pressable>
  )
}
