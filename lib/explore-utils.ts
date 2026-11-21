import { data, type ExploreArticle } from '@/data'
import { parseRichText } from '@/lib/rich-text'

/** The articles of a topic, in the order of the data file. The Names of Allah have their own file. */
export function getArticlesOfTopic(topicId: string): ExploreArticle[] {
  if (topicId === 'names-of-allah') return data.namesOfAllah
  return data.exploreArticles.filter((article) => article.topic === topicId)
}

export function findArticle(topicId: string, articleId: string): ExploreArticle | undefined {
  return getArticlesOfTopic(topicId).find((article) => article.id === articleId)
}

const plainTextCache = new Map<string, string>()

/** The article as plain text (tags removed), cached because the lists search and preview it on every keystroke. */
export function getArticleText(article: ExploreArticle): string {
  const key = `${article.topic}/${article.id}`
  let text = plainTextCache.get(key)
  if (text === undefined) {
    text = parseRichText(article.body)
      .map((block) => block.runs.map((run) => run.text).join(''))
      .join(' ')
    plainTextCache.set(key, text)
  }
  return text
}

/** The one-line preview under a title: the meaning of a name, or the start of the article. */
export const getArticlePreview = (article: ExploreArticle) => article.meaning ?? getArticleText(article)

/** What the topic search looks at: title, Arabic name, and the preview. */
export const articleSearchFields = (article: ExploreArticle) => [
  article.title,
  article.arabic,
  getArticlePreview(article),
]
