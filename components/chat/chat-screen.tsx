import { ChatBubble, TypingBubble } from '@/components/chat/chat-bubble'
import { ChatInput } from '@/components/chat/chat-input'
import { ExploreBackdrop } from '@/components/explore/explore-backdrop'
import { BackButton } from '@/components/ui/back-button'
import { ScreenHeader } from '@/components/ui/screen-header'
import { chatTheme } from '@/constants/chat-theme'
import { exploreTheme } from '@/constants/explore-theme'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useT } from '@/hooks/use-t'
import { askDuaAI, type ChatMessage } from '@/lib/duaai'
import tw from '@/lib/tailwind'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, Text, View } from 'react-native'

/**
 * Ask DuaAI. The conversation only lives in this screen's state, so it is gone when the user leaves
 * the screen or closes the app. Replies come from `askDuaAI` (lib/duaai.ts).
 */
export function ChatScreen() {
  const isDark = useColorScheme() === 'dark'
  const c = chatTheme[isDark ? 'dark' : 'light']
  const router = useRouter()
  const t = useT()
  const listRef = useRef<FlatList<ChatMessage>>(null)
  const nextId = useRef(0)
  const mounted = useRef(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return

    const userMessage: ChatMessage = { id: `u${nextId.current++}`, role: 'user', text }
    const history = [...messages, userMessage]
    setMessages(history)
    setInput('')
    setSending(true)

    let reply: ChatMessage
    try {
      const answer = await askDuaAI(history)
      reply = { id: `a${nextId.current++}`, role: 'assistant', ...answer }
    } catch {
      reply = { id: `a${nextId.current++}`, role: 'assistant', text: t('chat.error') }
    }
    // The user may have left the screen while waiting
    if (!mounted.current) return
    setMessages((current) => [...current, reply])
    setSending(false)
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors[isDark ? 'dark' : 'light'].screenBody }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('chat.title')}
        bottomPadding={16}
        left={<BackButton onPress={() => router.back()} color={exploreTheme[isDark ? 'dark' : 'light'].backIcon} />}
      />

      <ExploreBackdrop>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(message) => message.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={[tw`p-[16px]`, { flexGrow: 1, gap: 16 }]}
          ListHeaderComponent={
            messages.length > 0 ? (
              <Text style={[tw`font-nunito text-[12px] text-center`, { color: c.muted }]}>{t('chat.today')}</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={tw`flex-1 items-center justify-center px-[24px]`}>
              <Text style={[tw`font-nunito text-[15px] text-center`, { color: c.aiText }]}>{t('chat.empty')}</Text>
              <Text style={[tw`font-nunito text-[12px] text-center mt-[8px]`, { color: c.muted }]}>
                {t('chat.notSaved')}
              </Text>
            </View>
          }
          ListFooterComponent={sending ? <TypingBubble /> : null}
        />
      </ExploreBackdrop>

      <ChatInput value={input} onChangeText={setInput} onSend={send} sending={sending} />
    </KeyboardAvoidingView>
  )
}
