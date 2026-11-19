import { CollectionPills } from '@/components/dua-list/collection-pills'
import { DUA_ROW_HEIGHT } from '@/constants/dua-config'
import { useDuaListColors } from '@/hooks/use-dua-list-colors'
import { formatSourceLine } from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import type { Dua } from '@/redux/reducers/duasSlice'
import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'

interface DuaListRowProps {
  dua: Dua
  /** Position in the list (0-based); shown as 1, 2, 3... */
  index: number
  /** Favorites: also show which collections the dua belongs to. */
  showCollections?: boolean
  onPress?: () => void
  /** Shown at the right end of the row (the grip, while the list is being reordered). */
  trailing?: ReactNode
  /** Exactly one row tall, whatever is inside (a reorder list needs rows of one height). */
  fixedHeight?: boolean
}

/** One dua in a list: number, title, and source (e.g. "Al-Baqarah · 2:201"). */
export function DuaListRow({
  dua,
  index,
  showCollections = false,
  onPress,
  trailing,
  fixedHeight = false,
}: DuaListRowProps) {
  const c = useDuaListColors()
  const source = formatSourceLine(dua)

  const content = (
    <>
      <View
        style={[tw`w-[28px] h-[28px] rounded-full items-center justify-center`, { backgroundColor: c.circle }]}
      >
        <Text style={[tw`font-nunito text-[14px]`, { color: c.number }]}>
          {index + 1}
        </Text>
      </View>

      <View style={tw`flex-1 ml-[12px]`}>
        <Text numberOfLines={1} style={[tw`font-nunito text-[14px] leading-[20px]`, { color: c.title }]}>
          {dua.title}
        </Text>

        {!!source && (
          <Text numberOfLines={1} style={[tw`font-nunito text-[10px] leading-[14px]`, { color: c.subtitle }]}>
            {source}
          </Text>
        )}

        {showCollections && <CollectionPills categories={dua.categories} />}
      </View>

      {trailing && <View style={tw`ml-[4px] -mr-[10px]`}>{trailing}</View>}
    </>
  )

  const rowStyle = [
    tw`flex-row items-center rounded-[12px] px-[12px]`,
    fixedHeight
      ? { height: DUA_ROW_HEIGHT }
      : [tw`py-[8px]`, { minHeight: DUA_ROW_HEIGHT }],
    { backgroundColor: c.row },
  ]

  if (fixedHeight) {
    return <View style={rowStyle}>{content}</View>
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={dua.title}
      style={({ pressed }) => [
        ...rowStyle,
        { opacity: pressed && onPress ? 0.8 : 1 },
      ]}
    >
      {content}
    </Pressable>
  )
}
