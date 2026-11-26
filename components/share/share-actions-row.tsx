import { ACTION_CIRCLE } from '@/components/share/share-layout'
import { useShareColors } from '@/hooks/use-share-colors'
import { useT } from '@/hooks/use-t'
import type { ShareCardController } from '@/hooks/use-share-card'
import { SOCIAL_TARGETS } from '@/lib/share/social-targets'
import tw from '@/lib/tailwind'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'

interface ActionTile {
  id: string
  label: string
  icon: ComponentProps<typeof Ionicons>['name']
  /** Brand color of the circle. Plain actions use the neutral tile color. */
  color?: string
  onPress: () => void
}

interface ShareActionsRowProps {
  card: ShareCardController
  /** Opens the card editor. */
  onOpenCard: () => void
}

/**
 * The row at the bottom of the share sheet that scrolls sideways: the apps the card picture can go to
 * (WhatsApp, Instagram, Facebook, X, Telegram, Messenger), then Save image, Copy text, Card (the
 * editor) and More (the system share sheet, which lists every other app).
 */
export function ShareActionsRow({ card, onOpenCard }: ShareActionsRowProps) {
  const c = useShareColors()
  const t = useT()

  const tiles: ActionTile[] = [
    ...SOCIAL_TARGETS.map((target) => ({
      id: target.id,
      label: target.label,
      icon: target.icon,
      color: target.color,
      onPress: () => card.shareToApp(target),
    })),
    { id: 'save', label: t('share.action.save'), icon: 'download-outline', onPress: card.saveImage },
    { id: 'copy', label: t('share.action.copy'), icon: 'copy-outline', onPress: card.copyText },
    { id: 'card', label: t('share.action.card'), icon: 'color-palette-outline', onPress: onOpenCard },
    { id: 'more', label: t('share.action.more'), icon: 'ellipsis-horizontal', onPress: card.shareWithSystemSheet },
  ]

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-[12px] py-[4px]`}>
      {tiles.map((tile) => (
        <Pressable
          key={tile.id}
          onPress={tile.onPress}
          disabled={card.busy !== null && tile.id !== 'card'}
          accessibilityRole='button'
          accessibilityLabel={tile.label}
          style={({ pressed }) => [tw`items-center mx-[6px]`, { width: 64, opacity: pressed || (card.busy !== null && card.busy !== tile.id && tile.id !== 'card') ? 0.6 : 1 }]}
        >
          <View
            style={[
              tw`items-center justify-center rounded-full`,
              { width: ACTION_CIRCLE, height: ACTION_CIRCLE, backgroundColor: tile.color ?? c.tileBg, borderWidth: tile.color ? 0 : 1, borderColor: c.rowBorder },
            ]}
          >
            {card.busy === tile.id ? (
              <ActivityIndicator color={tile.color ? '#FFFFFF' : c.accent} />
            ) : (
              <Ionicons name={tile.icon} size={26} color={tile.color ? '#FFFFFF' : c.accent} />
            )}
          </View>
          <Text numberOfLines={1} style={[tw`font-nunito text-[11px] mt-[6px]`, { color: c.text }]}>
            {tile.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}
