import { chatTheme } from '@/constants/chat-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useT } from '@/hooks/use-t'
import type { ChatMessage } from '@/lib/duaai'
import tw from '@/lib/tailwind'
import { ActivityIndicator, Text, View } from 'react-native'

/** One message of the chat: the user's on the right, DuaAI's on the left (with an optional dua under the text). */
export function ChatBubble({ message }: { message: ChatMessage }) {
  const c = chatTheme[useColorScheme() === 'dark' ? 'dark' : 'light']
  const t = useT()

  if (message.role === 'user') {
    return (
      <View style={[tw`self-end rounded-[16px] px-[16px] py-[12px]`, { maxWidth: '80%', backgroundColor: c.userBubble }]}>
        <Text style={[tw`font-nunito text-[15px] leading-[22px]`, { color: c.userText }]}>{message.text}</Text>
      </View>
    )
  }

  return (
    <AssistantBubble>
      <Text style={[tw`font-nunito-semibold text-[12px]`, { color: c.sender }]}>{t('chat.sender')}</Text>
      <Text style={[tw`font-nunito text-[15px] leading-[22px] mt-[6px]`, { color: c.aiText }]}>{message.text}</Text>

      {message.dua && (
        <>
          <Text style={[tw`font-nunito-semibold text-[15px] leading-[22px] mt-[8px]`, { color: c.dua }]}>
            {message.dua.transliteration}
          </Text>
          <Text style={[tw`font-nunito text-[15px] leading-[22px] mt-[8px]`, { color: c.aiText }]}>
            {message.dua.translation}
          </Text>
          {message.dua.reference && (
            <Text style={[tw`font-nunito text-[11px] mt-[6px]`, { color: c.muted }]}>{message.dua.reference}</Text>
          )}
        </>
      )}
    </AssistantBubble>
  )
}

/** Shown while DuaAI is writing its reply. */
export function TypingBubble() {
  const c = chatTheme[useColorScheme() === 'dark' ? 'dark' : 'light']
  const t = useT()

  return (
    <AssistantBubble>
      <Text style={[tw`font-nunito-semibold text-[12px]`, { color: c.sender }]}>{t('chat.sender')}</Text>
      <View style={tw`mt-[8px] items-start`}>
        <ActivityIndicator size='small' color={c.muted} />
      </View>
    </AssistantBubble>
  )
}

function AssistantBubble({ children }: { children: React.ReactNode }) {
  const c = chatTheme[useColorScheme() === 'dark' ? 'dark' : 'light']

  return (
    <View
      style={[
        tw`self-start rounded-[16px] px-[16px] py-[12px]`,
        { maxWidth: '85%', backgroundColor: c.aiBubble, borderWidth: 1, borderColor: c.inputBorder },
      ]}
    >
      {children}
    </View>
  )
}
