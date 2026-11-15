import { CollectionPills } from '@/components/dua-list/collection-pills'
import { useDuaListColors } from '@/hooks/use-dua-list-colors'
import { formatSourceLine } from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import type { Dua } from '@/redux/reducers/duasSlice'
import { Pressable, Text, View } from 'react-native'

interface DuaListRowProps {
  dua: Dua
  /** Position in the list (0-based); shown as 1, 2, 3... */
  index: number
  /** Favorites: also show which collections the dua belongs to. */
  showCollections?: boolean
  onPress?: () => void
}

/** One dua in a list: number, title, and source (e.g. "Al-Baqarah · 2:201"). */
export function DuaListRow({ dua, index, showCollections = false, onPress }: DuaListRowProps) {
  const c = useDuaListColors()
  const source = formatSourceLine(dua)

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={dua.title}
      style={({ pressed }) => [
        tw`flex-row items-center rounded-[12px] px-[12px] py-[8px] min-h-[52px]`,
        { backgroundColor: c.row, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View
        style={[tw`w-[28px] h-[28px] rounded-full items-center justify-center`, { backgroundColor: c.circle }]}
      >
        <Text style={[tw`font-nunito text-[14px]`, { color: c.number }]}>{index + 1}</Text>
      </View>

      <View style={tw`flex-1 ml-[12px]`}>
        <Text numberOfLines={1} style={[tw`font-nunito text-[14px] leading-[20px]`, { color: c.title }]}>
          {dua.title}
        </Text>
        {!!source && (
          <Text
            numberOfLines={1}
            style={[tw`font-nunito text-[10px] leading-[14px]`, { color: c.subtitle }]}
          >
            {source}
          </Text>
        )}
        {showCollections && <CollectionPills categories={dua.categories} />}
      </View>
    </Pressable>
  )
}
