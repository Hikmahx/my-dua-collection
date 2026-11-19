import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { Pressable, Text, View } from 'react-native'

const SWATCH = 26
const RING = 3

interface ColorSwatchesProps {
  label: string
  colors: readonly string[]
  value: string
  onChange: (color: string) => void
}

/** A label and a row of round color choices; the chosen one has a ring. */
export function ColorSwatches({ label, colors, value, onChange }: ColorSwatchesProps) {
  const c = useSettingsColors()
  // a color that is not in the palette (e.g. one from the backend) still shows, as the chosen one
  const options = colors.some((color) => color.toUpperCase() === value.toUpperCase()) ? colors : [...colors, value]

  return (
    <View style={tw`mt-4`}>
      <Text style={[tw`font-nunito-semibold text-[13px] mb-2`, { color: c.title }]}>{label}</Text>
      <View style={tw`flex-row flex-wrap`}>
        {options.map((color) => {
          const selected = color.toUpperCase() === value.toUpperCase()
          return (
            <Pressable
              key={color}
              onPress={() => onChange(color)}
              hitSlop={4}
              accessibilityRole='radio'
              accessibilityLabel={`${label} ${color}`}
              accessibilityState={{ selected }}
              style={{
                width: SWATCH + RING * 2 + 2,
                height: SWATCH + RING * 2 + 2,
                borderRadius: 99,
                borderWidth: 2,
                borderColor: selected ? c.accent : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6,
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  width: SWATCH,
                  height: SWATCH,
                  borderRadius: SWATCH / 2,
                  backgroundColor: color,
                  borderWidth: 1,
                  borderColor: c.fieldBorder, // so white and cream stay visible
                }}
              />
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
