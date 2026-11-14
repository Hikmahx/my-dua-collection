import { PRESET_TARGETS } from '@/constants/tasbih-config'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import tw from '@/lib/tailwind'
import { Pressable, Text, View } from 'react-native'

function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const c = useTasbihColors()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        tw`h-[29px] rounded-full px-[18px] items-center justify-center border mr-[7px]`,
        {
          backgroundColor: active ? c.pillActiveBg : c.pillBg,
          borderColor: active ? c.pillActiveBg : c.pillBorder,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={[
          active ? tw`font-nunito-semibold` : tw`font-nunito`,
          { fontSize: 12, color: active ? c.pillActiveText : c.pillText },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

interface TasbihTargetSelectorProps {
  target: number
  onSelectPreset: (target: number) => void
  onSelectCustom: () => void
}

/** 33 / 100 / Custom pills. "Custom" is selected for any other target and shows its value. */
export function TasbihTargetSelector({
  target,
  onSelectPreset,
  onSelectCustom,
}: TasbihTargetSelectorProps) {
  const isCustom = !(PRESET_TARGETS as readonly number[]).includes(target)
  return (
    <View style={tw`flex-row`}>
      {PRESET_TARGETS.map((t) => (
        <Pill key={t} label={String(t)} active={target === t} onPress={() => onSelectPreset(t)} />
      ))}
      <Pill
        label={isCustom ? `Custom · ${target}` : 'Custom'}
        active={isCustom}
        onPress={onSelectCustom}
      />
    </View>
  )
}
