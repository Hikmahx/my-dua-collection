import { ArticleListScreen } from '@/components/explore/article-list-screen'
import { getExploreTopic } from '@/constants/explore-topics'
import { useLocalSearchParams } from 'expo-router'

/** The list of a topic's articles (or the 99 Names of Allah). Ask DuaAI has its own screen. */
export default function TopicScreen() {
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>()
  const topic = getExploreTopic(topicId)

  if (!topic || topic.kind === 'chat') return null
  return <ArticleListScreen topic={topic} />
}
