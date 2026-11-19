import { themeColors } from '@/constants/theme-colors'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import type { FilterMenuOption, FilterMenuProps } from '@/lib/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'

/**
 * Dropdown popup pinned under the element it was opened from (the header filter icon).
 * Right edges line up, like a normal dropdown. Long menus (e.g. many surahs) scroll.
 */
export function FilterMenu({
  visible,
  anchor,
  sections,
  onClose,
  closeOnSelect = true,
}: FilterMenuProps) {
  const isDark = useColorScheme() === 'dark'
  const { width: screenWidth, height: screenHeight } = useWindowDimensions()

  if (!anchor) return null

  const top = anchor.y + anchor.height + 8
  const right = Math.max(16, screenWidth - (anchor.x + anchor.width))
  // keep the panel on screen: the sections scroll when they don't fit
  const maxContentHeight = screenHeight - top - 24 - 16

  const renderOption = (option: FilterMenuOption) => (
    <Pressable
      key={option.id}
      accessibilityRole='button'
      accessibilityState={{ selected: !!option.selected }}
      onPress={() => {
        option.onSelect()
        if (closeOnSelect) onClose()
      }}
      style={tw`flex-row items-center px-4 py-2.5 mx-1 rounded-xl ${
        option.selected ? (isDark ? 'bg-white/10' : 'bg-pill-bg') : ''
      }`}
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
        <MaterialCommunityIcons name='check' size={18} color={themeColors.brightGold} />
      )}
    </Pressable>
  )

  const renderSectionBody = (section: FilterMenuProps['sections'][number]) => (
    <>
      {section.options?.map(renderOption)}
      {section.groups?.map((group) => (
        <View key={group.id} style={tw`pt-1`}>
          <Text
            style={tw`px-4 pt-1 pb-1 text-[11px] font-nunito-semibold ${
              isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'
            }`}
          >
            {group.title}
          </Text>
          {group.options.map(renderOption)}
        </View>
      ))}
    </>
  )

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={tw`flex-1`}>
        {/* tap anywhere outside to dismiss (a sibling of the panel, so the panel can scroll) */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel='Close menu'
        />

        <View
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
          <ScrollView
            style={{ maxHeight: maxContentHeight }}
            showsVerticalScrollIndicator={false}
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

                {section.maxHeight ? (
                  <ScrollView
                    nestedScrollEnabled
                    style={{ maxHeight: section.maxHeight }}
                    indicatorStyle={isDark ? 'white' : 'black'}
                  >
                    {renderSectionBody(section)}
                  </ScrollView>
                ) : (
                  renderSectionBody(section)
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
