import { Slider } from '@/components/ui/slider'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { Text, View } from 'react-native'

interface FontSizeSliderProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (size: number) => void
}

/** "Arabic ........ 28 px" with the slider under it. */
export function FontSizeSlider({ label, value, min, max, onChange }: FontSizeSliderProps) {
  const c = useSettingsColors()

  return (
    <View style={tw`mt-3`}>
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={[tw`font-nunito-semibold text-[13px]`, { color: c.title }]}>{label}</Text>
        <Text style={[tw`font-nunito text-[11px]`, { color: c.accent }]}>{value} px</Text>
      </View>
      <Slider
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        trackColor={c.sliderTrack}
        fillColor={c.sliderFill}
        thumbColor={c.sliderFill}
        accessibilityLabel={`${label} font size`}
      />
    </View>
  )
}
