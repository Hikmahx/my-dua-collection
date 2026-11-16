import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { Children, type ReactNode } from 'react'
import { Text, View } from 'react-native'

/**
 * 'card': the Settings screen look, a rounded card with a margin on each side.
 * 'flat': for the dua sidebar, the same content edge to edge with no rounded corners.
 */
export type SettingsVariant = 'card' | 'flat'

interface SettingsGroupProps {
  title: string
  variant?: SettingsVariant
  /** The rows (or any blocks) of the card. A divider is drawn between them. */
  children: ReactNode
}

/** A section title with a card under it. Every Settings section is one of these. */
export function SettingsGroup({ title, variant = 'card', children }: SettingsGroupProps) {
  const c = useSettingsColors()
  const isCard = variant === 'card'

  return (
    <View style={isCard ? tw`mb-6` : tw`mb-4`}>
      <Text
        style={[
          tw`font-nunito-extrabold text-[13px] mb-2 ${isCard ? 'px-6' : 'px-4'}`,
          { color: c.accent },
        ]}
      >
        {title}
      </Text>
      <View style={[isCard ? tw`mx-6 rounded-2xl` : undefined, { backgroundColor: c.card }]}>
        {Children.toArray(children).map((child, index) => (
          <View key={index} style={tw`px-4`}>
            {index > 0 && <View style={{ height: 1, backgroundColor: c.divider }} />}
            {child}
          </View>
        ))}
      </View>
    </View>
  )
}
