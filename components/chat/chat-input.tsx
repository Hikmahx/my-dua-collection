import { chatTheme } from '@/constants/chat-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useT } from '@/hooks/use-t'
import tw from '@/lib/tailwind'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, TextInput, View } from 'react-native'

interface ChatInputProps {
  value: string
  onChangeText: (text: string) => void
  onSend: () => void
  /** True while DuaAI is replying: sending is off until it has answered. */
  sending: boolean
}

/** The bar at the bottom of the chat: a text box with a sparkle icon, and the round send button. */
export function ChatInput({ value, onChangeText, onSend, sending }: ChatInputProps) {
  const c = chatTheme[useColorScheme() === 'dark' ? 'dark' : 'light']
  const t = useT()
  const canSend = value.trim().length > 0 && !sending

  return (
    <View
      style={[
        tw`flex-row items-center px-[16px] py-[12px]`,
        { backgroundColor: c.inputBar, borderTopWidth: 1, borderColor: c.inputBorder, gap: 12 },
      ]}
    >
      <View
        style={[
          tw`flex-1 flex-row items-center rounded-[16px] px-[12px]`,
          { minHeight: 52, backgroundColor: c.inputBg, borderWidth: 1, borderColor: c.inputBorder },
        ]}
      >
        <MaterialCommunityIcons name='star-four-points-outline' size={22} color={c.icon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t('chat.placeholder')}
          placeholderTextColor={c.placeholder}
          multiline
          style={[tw`flex-1 font-nunito text-[16px] ml-[10px] py-[10px]`, { color: c.inputText, maxHeight: 110 }]}
        />
      </View>

      <Pressable
        onPress={onSend}
        disabled={!canSend}
        accessibilityRole='button'
        accessibilityLabel={t('chat.send')}
        style={[
          tw`items-center justify-center rounded-full`,
          { width: 52, height: 52, backgroundColor: c.sendBg, opacity: canSend ? 1 : 0.5 },
        ]}
      >
        <Feather name='send' size={22} color={c.sendIcon} style={{ marginRight: 2 }} />
      </Pressable>
    </View>
  )
}
