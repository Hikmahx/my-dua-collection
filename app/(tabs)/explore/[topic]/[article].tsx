import { ArticleScreen } from '@/components/explore/article-screen'
import { getExploreTopic } from '@/constants/explore-topics'
import { findArticle } from '@/lib/explore-utils'
import { useLocalSearchParams } from 'expo-router'

/** One article of a topic. */
export default function ArticleRoute() {
  const { topic: topicId, article: articleId } = useLocalSearchParams<{ topic: string; article: string }>()
  const topic = getExploreTopic(topicId)
  const article = topic ? findArticle(topic.id, articleId) : undefined

  if (!topic || !article) return null
  return <ArticleScreen topic={topic} article={article} />
}
