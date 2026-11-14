import { ArabicText } from '@/components/ui/arabic-text'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import type { TasbihItem } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import { Text, View } from 'react-native'

/**
 * A dua in compact form: title, Arabic and translation, one line each, "…" when a line is longer.
 * Used in the picker rows and in the "change dua?" confirmation.
 */
export function TasbihDuaLines({ item }: { item: TasbihItem }) {
  const c = useTasbihColors()
  return (
    <View>
      <Text numberOfLines={1} style={[tw`font-nunito-semibold text-[15px]`, { color: c.text }]}>
        {item.title}
      </Text>
      <ArabicText numberOfLines={1} size={18} color={c.arabic} style={tw`text-right`}>
        {item.arabic}
      </ArabicText>
      <Text numberOfLines={1} style={[tw`font-nunito text-[12px]`, { color: c.translation }]}>
        {item.translation}
      </Text>
    </View>
  )
}
