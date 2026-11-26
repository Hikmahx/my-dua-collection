import { useShareColors } from '@/hooks/use-share-colors'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'

export const TILE_CIRCLE = 68

interface PickerTileProps {
  label: string
  /** A second, smaller line (e.g. how many people are in a group). */
  caption?: string
  /** 'all' draws a tick on the circle. */
  selection?: 'none' | 'all'
  onPress: () => void
  /** The picture inside the circle. */
  children: ReactNode
}

/** One cell of the share sheet's grid (like Instagram's): a round picture, a name under it, and a badge when picked. Three fit in a row. */
export function PickerTile({ label, caption, selection = 'none', onPress, children }: PickerTileProps) {
  const c = useShareColors()

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={caption ? `${label}, ${caption}` : label}
      accessibilityState={{ selected: selection === 'all' }}
      style={({ pressed }) => [tw`items-center px-[4px] py-[10px]`, { width: '33.3333%', opacity: pressed ? 0.75 : 1 }]}
    >
      <View style={{ width: TILE_CIRCLE, height: TILE_CIRCLE }}>
        <View
          style={{
            width: TILE_CIRCLE,
            height: TILE_CIRCLE,
            borderRadius: TILE_CIRCLE / 2,
            overflow: 'hidden',
            borderWidth: selection === 'none' ? 0 : 2,
            borderColor: c.checkOn,
          }}
        >
          {children}
        </View>
        {selection !== 'none' && (
          <View
            style={[
              tw`absolute items-center justify-center rounded-full`,
              { right: -2, bottom: -2, width: 24, height: 24, backgroundColor: c.checkOn, borderWidth: 2, borderColor: c.sheetBg },
            ]}
          >
            <Feather name='check' size={14} color={c.checkOnText} />
          </View>
        )}
      </View>
      <Text numberOfLines={2} style={[tw`font-nunito-semibold text-[12px] leading-[16px] text-center mt-[8px]`, { color: c.text }]}>
        {label}
      </Text>
      {caption ? <Text style={[tw`font-nunito text-[11px] text-center`, { color: c.muted }]}>{caption}</Text> : null}
    </Pressable>
  )
}
