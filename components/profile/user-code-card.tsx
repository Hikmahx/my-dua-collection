import { useSettingsColors } from '@/hooks/use-settings-colors'
import { copyText } from '@/lib/clipboard'
import tw from '@/lib/tailwind'
import { formatUserCode } from '@/lib/user-code'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const COPIED_MS = 1600

interface UserCodeCardProps {
  /** In stored form, e.g. 'BG7K3M'. Shown as 'BG-7K3M'. */
  code: string
  /** The user tapped "Reset code" (the screen asks them to confirm). */
  onReset: () => void
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: 'content-copy' | 'check' | 'refresh'
  label: string
  onPress: () => void
}) {
  const c = useSettingsColors()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      style={({ pressed }) => [
        tw`flex-row items-center h-[38px] px-4 rounded-full mr-3`,
        { backgroundColor: c.field, borderWidth: 1, borderColor: c.fieldBorder, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={16} color={c.accent} style={tw`mr-2`} />
      <Text style={[tw`font-nunito-semibold text-[13px]`, { color: c.title }]}>{label}</Text>
    </Pressable>
  )
}

/** The user's code, with Copy and Reset code. Friends type the code to share a dua with them. */
export function UserCodeCard({ code, onReset }: UserCodeCardProps) {
  const c = useSettingsColors()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <View style={tw`py-4`}>
      <Text style={[tw`font-nunito-semibold text-[13px]`, { color: c.title }]}>Your user code</Text>
      <Text
        selectable
        style={[tw`font-nunito-extrabold text-[26px] mt-2`, { color: c.accent, letterSpacing: 2 }]}
      >
        {formatUserCode(code)}
      </Text>
      <Text style={[tw`font-nunito text-[11px] mt-2 mb-3 leading-[16px]`, { color: c.muted }]}>
        Friends type this code to share a dua with you. It stays the same when you change your name.
      </Text>
      <View style={tw`flex-row`}>
        <ActionButton
          icon={copied ? 'check' : 'content-copy'}
          label={copied ? 'Copied' : 'Copy'}
          onPress={async () => {
            await copyText(formatUserCode(code))
            setCopied(true)
          }}
        />
        <ActionButton icon='refresh' label='Reset code' onPress={onReset} />
      </View>
    </View>
  )
}
