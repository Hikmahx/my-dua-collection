import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import { toggleSound, toggleVibration } from '@/redux/reducers/tasbihSlice'
import type { RootState } from '@/redux/store'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

interface ToggleProps {
  enabled: boolean
  onIcon: keyof typeof MaterialCommunityIcons.glyphMap
  offIcon: keyof typeof MaterialCommunityIcons.glyphMap
  label: string
  onPress: () => void
}

function ToggleIconButton({ enabled, onIcon, offIcon, label, onPress }: ToggleProps) {
  const c = useTasbihColors()
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole='switch'
      accessibilityLabel={label}
      accessibilityState={{ checked: enabled }}
      style={({ pressed }) => [tw`p-[6px]`, { opacity: pressed ? 0.7 : 1 }]}
    >
      <MaterialCommunityIcons
        name={enabled ? onIcon : offIcon}
        size={24}
        color={enabled ? c.toggleOn : c.toggleOff}
      />
    </Pressable>
  )
}

/** Sound and vibration switches (saved with the rest of the Tasbih state). */
export function TasbihFeedbackToggles() {
  const dispatch = useDispatch()
  const { soundEnabled, vibrationEnabled } = useSelector((s: RootState) => s.tasbih)

  return (
    <View style={tw`flex-row items-center`}>
      <ToggleIconButton
        enabled={soundEnabled}
        onIcon='volume-high'
        offIcon='volume-off'
        label='Sound'
        onPress={() => dispatch(toggleSound())}
      />
      <ToggleIconButton
        enabled={vibrationEnabled}
        onIcon='vibrate'
        offIcon='vibrate-off'
        label='Vibration'
        onPress={() => dispatch(toggleVibration())}
      />
    </View>
  )
}
