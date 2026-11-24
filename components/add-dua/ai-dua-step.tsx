import { FormInput } from '@/components/add-dua/form-field'
import { useAddDuaColors } from '@/hooks/use-add-dua-colors'
import { useT } from '@/hooks/use-t'
import { generateDua, type DuaDraft } from '@/lib/dua-draft'
import tw from '@/lib/tailwind'
import type { TranslationKey } from '@/locales'
import { Feather } from '@expo/vector-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

interface AiDuaStepProps {
  /** Language of the translation to ask for (the one chosen in Settings). */
  language: string
  /** What the user asked for. It lives in the form, so it is still there when they come back from the filled-in form. */
  prompt: string
  onPromptChange: (prompt: string) => void
  /** The dua was written: the form is filled in with it. */
  onDraft: (draft: DuaDraft) => void
}

const EXAMPLES: readonly TranslationKey[] = [
  'addDua.ai.example1',
  'addDua.ai.example2',
  'addDua.ai.example3',
  'addDua.ai.example4',
]

/**
 * "AI generated Dua": the user describes the dua they need, the AI writes it, and the result is handed to the form as a
 * draft to check and edit. The AI can be wrong, so the screen says so up front, and the form marks what it filled in.
 */
export function AiDuaStep({ language, prompt, onPromptChange, onDraft }: AiDuaStepProps) {
  const c = useAddDuaColors()
  const t = useT()
  const [generating, setGenerating] = useState(false)
  const [failed, setFailed] = useState(false)
  // A result that comes back after the user left the screen is ignored
  const active = useRef(true)
  useEffect(
    () => () => {
      active.current = false
    },
    [],
  )

  const generate = useCallback(
    async (text: string) => {
      if (!text.trim() || generating) return
      setGenerating(true)
      setFailed(false)
      try {
        const draft = await generateDua(text.trim(), language)
        if (active.current) onDraft(draft)
      } catch (error) {
        console.warn(error)
        if (active.current) setFailed(true)
      } finally {
        if (active.current) setGenerating(false)
      }
    },
    [generating, language, onDraft],
  )

  return (
    <View>
      <Text style={tw`text-sm ${c.muted} mb-3`}>{t('addDua.ai.intro')}</Text>

      <FormInput
        placeholder={t('addDua.ai.placeholder')}
        value={prompt}
        onChangeText={onPromptChange}
        multiline
        numberOfLines={3}
        editable={!generating}
        textAlignVertical='top'
        maxLength={300}
        style={{ minHeight: 84 }}
      />

      {/* Ideas to start from */}
      <Text style={tw`text-xs font-semibold ${c.muted} mt-4 mb-2`}>{t('addDua.ai.examples')}</Text>
      <View style={tw`flex-row flex-wrap gap-2`}>
        {EXAMPLES.map((key) => (
          <Pressable
            key={key}
            disabled={generating}
            onPress={() => onPromptChange(t(key))}
            style={({ pressed }) => [
              tw`px-3 py-1.5 rounded-full border ${c.border} ${c.inputBg}`,
              { opacity: generating ? 0.5 : pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={tw`text-xs font-semibold ${c.text}`}>{t(key)}</Text>
          </Pressable>
        ))}
      </View>

      <View style={tw`flex-row items-start mt-5`}>
        <Feather name='alert-circle' size={14} color='#C2A462' style={tw`mt-0.5 mr-2`} />
        <Text style={tw`flex-1 text-xs ${c.muted}`}>{t('addDua.ai.warning')}</Text>
      </View>

      {failed && (
        <View style={tw`mt-4`}>
          <Text style={tw`font-semibold ${c.text}`}>{t('addDua.ai.errorTitle')}</Text>
          <Text style={tw`text-sm ${c.muted} mt-0.5`}>{t('addDua.ai.errorBody')}</Text>
        </View>
      )}

      <Pressable
        onPress={() => generate(prompt)}
        disabled={generating || !prompt.trim()}
        accessibilityRole='button'
        style={({ pressed }) => [
          tw`mt-5 px-4 py-3 rounded-lg bg-dark-emerald flex-row items-center justify-center`,
          { opacity: !prompt.trim() && !generating ? 0.5 : pressed ? 0.8 : 1 },
        ]}
      >
        {generating && <ActivityIndicator color='#C2A462' style={tw`mr-2`} />}
        <Text style={tw`font-semibold text-light-grayish-text`}>{generating ? t('addDua.ai.generating') : t('addDua.ai.generate')}</Text>
      </Pressable>
    </View>
  )
}
