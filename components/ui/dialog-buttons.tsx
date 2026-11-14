import { GoldButton } from '@/components/ui/gold-button'
import { themeColors } from '@/constants/theme-colors'
import tw from '@/lib/tailwind'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Pressable, Text, View } from 'react-native'

interface DialogButtonsProps {
  cancelLabel?: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  confirmDisabled?: boolean
  /** Always use the dark look (for dialogs drawn on a black backdrop). */
  forceDark?: boolean
}

/** Cancel (outlined) + confirm (gold) buttons shared by every dialog. */
export function DialogButtons({
  cancelLabel = 'Cancel',
  confirmLabel,
  onCancel,
  onConfirm,
  confirmDisabled = false,
  forceDark = false,
}: DialogButtonsProps) {
  const isDark = useColorScheme() === 'dark' || forceDark

  return (
    <View style={tw`flex-row`}>
      <Pressable
        onPress={onCancel}
        accessibilityRole='button'
        style={({ pressed }) => [
          tw`flex-1 h-[44px] rounded-full items-center justify-center border mr-[10px]`,
          { borderColor: isDark ? themeColors.darkGrayishBorder : themeColors.veryLightGrayishBorder, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={tw`font-nunito-semibold text-[14px] ${isDark ? 'text-white' : 'text-dark-text'}`}>
          {cancelLabel}
        </Text>
      </Pressable>
      <GoldButton
        label={confirmLabel}
        onPress={onConfirm}
        disabled={confirmDisabled}
        style={tw`flex-1`}
      />
    </View>
  )
}
