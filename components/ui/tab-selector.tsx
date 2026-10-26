import { themeColors } from '@/constants/themeColors'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

interface TabItem {
  label: string
  id: string
}

interface TabSelectorProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function TabSelector({
  tabs,
  activeTab,
  onTabChange,
}: TabSelectorProps) {
  const isDark = useColorScheme() === 'dark'

  return (
    <View
      style={tw`flex-row items-center p-1 rounded-full ${isDark ? 'bg-very-dark-bg' : 'bg-pill-bg'}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const textClass = isActive
          ? 'text-white font-nunito-semibold'
          : isDark
            ? 'text-light-grayish-text-muted font-nunito'
            : 'text-dark-grayish-text font-nunito'
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={({ pressed }) => [
              tw`rounded-full overflow-hidden items-center justify-center min-h-[20px] ${isActive ? 'px-[11px] mr-[5px]' : 'px-[6px]'}`,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            {isActive && (
              // gold gradient behind the active label
              <Svg style={StyleSheet.absoluteFill} preserveAspectRatio='none'>
                <Defs>
                  <LinearGradient id='pillGold' x1='0' y1='0' x2='1' y2='1'>
                    <Stop offset='0' stopColor={themeColors.softGold} />
                    <Stop offset='1' stopColor={themeColors.darkGold} />
                  </LinearGradient>
                </Defs>
                <Rect width='100%' height='100%' fill='url(#pillGold)' />
              </Svg>
            )}
            <Text numberOfLines={1} style={tw`text-[9px] ${textClass}`}>
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
