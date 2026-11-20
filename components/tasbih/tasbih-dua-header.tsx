import { useT } from '@/hooks/use-t'
import { ArabicText } from '@/components/ui/arabic-text'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import { tasbihArabicSize, type TasbihItem } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'

/** Each of the three texts is shown in full, up to this many lines, then "…". */
const MAX_LINES = 3

interface TasbihDuaHeaderProps {
  item: TasbihItem
  onPress: () => void
}

/** Arabic text + chevron, transliteration and translation of the dua being counted. Tap to see it in full. */
export function TasbihDuaHeader({ item, onPress }: TasbihDuaHeaderProps) {
  const t = useT()
  const c = useTasbihColors()

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={t('tasbih.counting', { title: item.title })}
      style={({ pressed }) => [tw`items-center`, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={tw`flex-row items-center`}>
        <ArabicText
          numberOfLines={MAX_LINES}
          size={tasbihArabicSize(item.arabic)}
          color={c.arabic}
          style={tw`text-center shrink`}
        >
          {item.arabic}
        </ArabicText>
        <MaterialCommunityIcons
          name='chevron-down'
          size={18}
          color={c.arabic}
          style={tw`ml-[8px]`}
        />
      </View>
      {!!item.transliteration && (
        <Text
          numberOfLines={MAX_LINES}
          style={[tw`font-berkshire text-[15px] text-center mt-[6px]`, { color: c.translit }]}
        >
          {item.transliteration}
        </Text>
      )}
      <Text
        numberOfLines={MAX_LINES}
        style={[tw`font-nunito text-[11px] text-center mt-[10px]`, { color: c.translation }]}
      >
        {item.translation}
      </Text>
    </Pressable>
  )
}
