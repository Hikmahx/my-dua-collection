import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ComponentProps, ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'

export type SettingsIconName = ComponentProps<typeof MaterialCommunityIcons>['name']

interface SettingsRowProps {
  icon: SettingsIconName
  title: string
  subtitle?: string
  /** Makes the row tappable (e.g. opens a screen). */
  onPress?: () => void
  /** Something at the right edge, e.g. a toggle. */
  control?: ReactNode
  /** Show the ">" chevron. Defaults to true when there is no control. */
  chevron?: boolean
}

/** One line of a Settings card: icon, title, optional subtitle, then a chevron and/or a control. */
export function SettingsRow({ icon, title, subtitle, onPress, control, chevron }: SettingsRowProps) {
  const c = useSettingsColors()
  const showChevron = chevron ?? !control

  const content = (
    <View style={tw`flex-row items-center py-[15px]`}>
      <MaterialCommunityIcons name={icon} size={22} color={c.accent} style={tw`mr-[10px]`} />
      <View style={tw`flex-1 pr-2`}>
        <Text style={[tw`font-nunito-semibold text-[14px]`, { color: c.title }]}>{title}</Text>
        {!!subtitle && (
          <Text style={[tw`font-nunito text-[11px] mt-[3px]`, { color: c.muted }]}>{subtitle}</Text>
        )}
      </View>
      {showChevron && <MaterialCommunityIcons name='chevron-right' size={20} color={c.muted} />}
      {control && <View style={showChevron ? tw`ml-3` : undefined}>{control}</View>}
    </View>
  )

  if (!onPress) return content

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={title}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {content}
    </Pressable>
  )
}
