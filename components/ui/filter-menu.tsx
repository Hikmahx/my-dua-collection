import { themeColors } from '@/constants/themeColors'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native'

type IconName = keyof typeof MaterialCommunityIcons.glyphMap

export interface FilterMenuOption {
  id: string
  label: string
  icon?: IconName
  selected?: boolean
  onSelect: () => void
}

/** One titled group of options. Add a new section object to grow the menu. */
export interface FilterMenuSection {
  id: string
  title: string
  options: FilterMenuOption[]
}

export interface FilterMenuAnchor {
  x: number
  y: number
  width: number
  height: number
}

interface FilterMenuProps {
  visible: boolean
  anchor: FilterMenuAnchor | null
  sections: FilterMenuSection[]
  onClose: () => void
  closeOnSelect?: boolean
}

/**
 * Dropdown popup pinned under the element it was opened from (the header filter icon).
 * Right edges line up, like a normal dropdown.
 */
export function FilterMenu({
  visible,
  anchor,
  sections,
  onClose,
  closeOnSelect = true,
}: FilterMenuProps) {
  const isDark = useColorScheme() === 'dark'
  const { width: screenWidth } = useWindowDimensions()

  if (!anchor) return null

  const top = anchor.y + anchor.height + 8
  const right = Math.max(16, screenWidth - (anchor.x + anchor.width))

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* tap anywhere outside to dismiss */}
      <Pressable style={tw`flex-1`} onPress={onClose}>
        <View
          // swallow touches so tapping the panel itself doesn't dismiss it
          onStartShouldSetResponder={() => true}
          style={[
            tw`absolute rounded-2xl py-2 border ${
              isDark
                ? 'bg-very-dark-bg border-white/10'
                : 'bg-white border-black/5'
            }`,
            {
              top,
              right,
              width: 220,
              maxWidth: screenWidth - 32,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.4 : 0.12,
              shadowRadius: 16,
              elevation: 8,
            },
          ]}
        >
          {sections.map((section, index) => (
            <View
              key={section.id}
              style={tw`${
                index > 0
                  ? `mt-1 pt-2 border-t ${isDark ? 'border-white/10' : 'border-black/5'}`
                  : ''
              }`}
            >
              <Text
                style={tw`px-4 pb-1 text-[10px] uppercase tracking-widest font-nunito-bold ${
                  isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'
                }`}
              >
                {section.title}
              </Text>

              {section.options.map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    option.onSelect()
                    if (closeOnSelect) onClose()
                  }}
                  style={({ pressed }) =>
                    tw`flex-row items-center px-4 py-2.5 mx-1 rounded-xl ${
                      option.selected || pressed
                        ? isDark
                          ? 'bg-white/10'
                          : 'bg-pill-bg'
                        : ''
                    }`
                  }
                >
                  {option.icon && (
                    <MaterialCommunityIcons
                      name={option.icon}
                      size={18}
                      color={option.selected ? themeColors.brightGold : isDark ? '#FFFFFF' : '#1A1A1A'}
                      style={tw`mr-3`}
                    />
                  )}
                  <Text
                    style={tw`flex-1 text-[14px] ${
                      option.selected ? 'font-nunito-bold' : 'font-nunito'
                    } ${isDark ? 'text-white' : 'text-dark-text'}`}
                  >
                    {option.label}
                  </Text>
                  {option.selected && (
                    <MaterialCommunityIcons
                      name='check'
                      size={18}
                      color={themeColors.brightGold}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </Pressable>
    </Modal>
  )
}
