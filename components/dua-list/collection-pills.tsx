import { useCollections } from '@/hooks/use-collections'
import { useDuaListColors } from '@/hooks/use-dua-list-colors'
import tw from '@/lib/tailwind'
import { Text, View } from 'react-native'

/** More collections than this are summarised as "+N". */
const MAX_VISIBLE = 2

function Pill({ label }: { label: string }) {
  const c = useDuaListColors()
  return (
    <View
      style={[
        tw`h-[18px] rounded-full px-[8px] mr-[5px] justify-center`,
        { backgroundColor: c.pillBg },
      ]}
    >
      <Text numberOfLines={1} style={[tw`font-nunito-semibold text-[9px]`, { color: c.pillText }]}>
        {label}
      </Text>
    </View>
  )
}

/** Small pills with the collections a dua belongs to, by collection id (used in Favorites). */
export function CollectionPills({ collectionIds }: { collectionIds: string[] }) {
  const { getName } = useCollections()
  if (collectionIds.length === 0) return null
  const visible = collectionIds.slice(0, MAX_VISIBLE)
  const hidden = collectionIds.length - visible.length

  return (
    <View style={tw`flex-row flex-wrap mt-[6px]`}>
      {visible.map((id) => (
        <Pill key={id} label={getName(id)} />
      ))}
      {hidden > 0 && <Pill label={`+${hidden}`} />}
    </View>
  )
}
