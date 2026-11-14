import { TasbihDuaLines } from '@/components/tasbih/tasbih-dua-lines'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import type { TasbihItem } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import { View } from 'react-native'

/** The compact dua in a small box, shown inside the "Change dua?" confirmation. */
export function TasbihDuaPreview({ item }: { item: TasbihItem }) {
  const c = useTasbihColors()
  return (
    <View
      style={[
        tw`rounded-[12px] px-[14px] py-[10px] border`,
        { backgroundColor: c.rowBg, borderColor: c.rowBorder },
      ]}
    >
      <TasbihDuaLines item={item} />
    </View>
  )
}
