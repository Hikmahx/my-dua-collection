import { ReorderableList } from '@/components/ui/reorderable-list'
import { useCollectionEditColors } from '@/hooks/use-collection-edit-colors'
import tw from '@/lib/tailwind'
import { Pressable, Text, View } from 'react-native'

export interface ReorderableDua {
  id: string
  title: string
  /** e.g. "Al-Baqarah · 2:201" */
  subtitle?: string
}

interface ReorderableDuaListProps {
  duas: ReorderableDua[]
  /** Called with the new order of ids when a drag ends in a different place. */
  onReorder: (ids: string[]) => void
  onRemove: (id: string) => void
  emptyMessage: string
}

/**
 * The duas of the collection being edited, as rows that can be dragged into a new order (by the
 * dots on the right) or removed (the red dash on the left). The dragging itself is the shared
 * `ReorderableList`; this only draws a row.
 */
export function ReorderableDuaList({ duas, onReorder, onRemove, emptyMessage }: ReorderableDuaListProps) {
  const c = useCollectionEditColors()

  return (
    <ReorderableList
      items={duas}
      onReorder={onReorder}
      getLabel={(dua) => dua.title}
      handleColor={c.handle}
      emptyMessage={emptyMessage}
      emptyColor={c.muted}
      renderRow={(dua, _index, handle) => (
        <View style={[tw`flex-1 flex-row items-center rounded-[12px] pl-[16px] pr-[12px]`, { backgroundColor: c.row }]}>
          <Pressable
            onPress={() => onRemove(dua.id)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 8 }}
            accessibilityRole='button'
            accessibilityLabel={`Remove ${dua.title} from this collection`}
            style={tw`w-[12px] h-[24px] items-center justify-center`}
          >
            <View style={[tw`w-[12px] h-[2px] rounded-full`, { backgroundColor: c.minus }]} />
          </Pressable>

          <View style={tw`flex-1 ml-[16px]`}>
            <Text numberOfLines={1} style={[tw`font-nunito-semibold text-[14px] leading-[20px]`, { color: c.text }]}>
              {dua.title}
            </Text>
            {!!dua.subtitle && (
              <Text numberOfLines={1} style={[tw`font-nunito text-[10px] leading-[14px]`, { color: c.muted }]}>
                {dua.subtitle}
              </Text>
            )}
          </View>

          {handle}
        </View>
      )}
    />
  )
}
