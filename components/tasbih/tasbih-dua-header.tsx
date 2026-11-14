import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import type { TasbihItem } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'

// Long duas (e.g. Quranic verses) get a smaller Arabic size so the counter always fits
const arabicSize = (text: string) => (text.length <= 30 ? 30 : text.length <= 80 ? 24 : 19)

interface TasbihDuaHeaderProps {
  item: TasbihItem
  onPress: () => void
}

/** Arabic text + chevron, transliteration and translation of the dua being counted. Tap to change it. */
export function TasbihDuaHeader({ item, onPress }: TasbihDuaHeaderProps) {
  const c = useTasbihColors()
  const fontSize = arabicSize(item.arabic)

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={`Counting ${item.transliteration}. Change dua`}
      style={({ pressed }) => [tw`items-center`, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={tw`flex-row items-center`}>
        <Text
          numberOfLines={3}
          style={[
            tw`font-arabic text-center shrink`,
            { color: c.arabic, fontSize, lineHeight: fontSize * 1.5 },
          ]}
        >
          {item.arabic}
        </Text>
        <MaterialCommunityIcons
          name='chevron-down'
          size={18}
          color={c.arabic}
          style={tw`ml-[8px]`}
        />
      </View>
      <Text
        numberOfLines={2}
        style={[tw`font-berkshire text-[15px] text-center mt-[10px]`, { color: c.translit }]}
      >
        {item.transliteration}
      </Text>
      <Text
        numberOfLines={2}
        style={[tw`font-nunito text-[11px] text-center mt-[10px]`, { color: c.translation }]}
      >
        {item.translation}
      </Text>
    </Pressable>
  )
}
