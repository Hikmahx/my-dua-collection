import ExploreIcon from '@/components/icons/explore-icon'
import { themeColors as p } from '@/constants/theme-colors'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import { Pressable, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native'

const searchTheme = {
  dark: {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: p.darkGrayishBorder,
    icon: p.brightGold,
    text: p.lightGrayishText,
    placeholder: '#7F9CA3',
  },
  light: {
    bg: p.pillBg,
    border: p.veryLightGrayishBorder,
    icon: p.brightGold,
    text: p.darkText,
    placeholder: '#8A8A8A',
  },
} as const

interface SearchFieldProps {
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  autoFocus?: boolean
  /** 'characters' for a field that takes a code. */
  autoCapitalize?: TextInputProps['autoCapitalize']
  maxLength?: number
  returnKeyType?: TextInputProps['returnKeyType']
  /** The keyboard's search / go button. */
  onSubmitEditing?: () => void
  style?: StyleProp<ViewStyle>
}

/** Rounded search bar with the gold magnifier and a clear button. */
export function SearchField({
  value,
  onChangeText,
  placeholder,
  autoFocus,
  autoCapitalize,
  maxLength,
  returnKeyType = 'search',
  onSubmitEditing,
  style,
}: SearchFieldProps) {
  const isDark = useColorScheme() === 'dark'
  const c = searchTheme[isDark ? 'dark' : 'light']

  return (
    <View
      style={[
        tw`flex-row items-center h-[46px] rounded-[12px] px-[16px]`,
        { backgroundColor: c.bg, borderWidth: 1, borderColor: c.border },
        style,
      ]}
    >
      <ExploreIcon color={c.icon} size={16} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.placeholder}
        returnKeyType={returnKeyType}
        autoCorrect={false}
        autoFocus={autoFocus}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        onSubmitEditing={onSubmitEditing}
        style={[tw`flex-1 font-nunito text-[14px] ml-[12px] p-0`, { color: c.text }]}
      />
      {value.length > 0 && (
        <Pressable hitSlop={10} onPress={() => onChangeText('')}>
          <Feather name='x' size={16} color={c.placeholder} />
        </Pressable>
      )}
    </View>
  )
}
