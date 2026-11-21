/** A dua inside an assistant reply (shown as transliteration, translation and source). */
export interface ChatDua {
  transliteration: string
  translation: string
  /** e.g. "Qur'an 3:173" */
  reference?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  /** Assistant replies only: a dua to show under the text. */
  dua?: ChatDua
}

export type ChatReply = Pick<ChatMessage, 'text' | 'dua'>

/**
 * Asks DuaAI and returns its reply. `history` is the whole chat so far, ending with the user's
 * new message. The chat is never saved, so the history only lives in the screen.
 *
 * PLACEHOLDER until the AI backend exists: it waits a moment and returns the sample replies from
 * the design (the first one with a dua, then a plain one). The real version sends `history` to the
 * backend (which holds the AI key, never the app) and returns its reply. Nothing outside this
 * file needs to change.
 */
export async function askDuaAI(history: ChatMessage[]): Promise<ChatReply> {
  await new Promise((resolve) => setTimeout(resolve, 900))

  const hasAnswered = history.some((message) => message.role === 'assistant')
  if (hasAnswered) {
    return { text: 'Yes. You can say it whenever you feel worried or need reassurance.' }
  }
  return {
    text: 'Try this short dua of trust in Allah:',
    dua: {
      transliteration: "Hasbunallahu wa ni'mal-wakil.",
      translation: '\u201CAllah is sufficient for us, and He is the best Disposer of affairs.\u201D',
      reference: "Qur'an 3:173",
    },
  }
}
