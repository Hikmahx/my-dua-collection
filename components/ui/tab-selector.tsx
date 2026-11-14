import { themeColors } from '@/constants/theme-colors'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
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

interface TabButtonProps {
  label: string
  isActive: boolean
  isDark: boolean
  onPress: () => void
}

function TabButton({ label, isActive, isDark, onPress }: TabButtonProps) {
  // The gold gradient is drawn at the button's *measured* size. Sizing it with absoluteFill and
  // no width/height could leave it at a stale (narrower) size when the label's layout changed.
  const [size, setSize] = useState({ width: 0, height: 0 })

  const textClass = isActive
    ? 'text-white font-nunito-semibold'
    : isDark
      ? 'text-light-grayish-text-muted font-nunito'
      : 'text-dark-grayish-text font-nunito'

  return (
    <Pressable
      onPress={onPress}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout
        setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
      }}
      style={({ pressed }) => [
        tw`rounded-full overflow-hidden items-center justify-center min-h-[20px] ${isActive ? 'px-[11px] mr-[5px]' : 'px-[6px]'}`,
        { opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {isActive && size.width > 0 && (
        // gold gradient behind the active label
        <Svg
          width={size.width}
          height={size.height}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Defs>
            <LinearGradient id='pillGold' x1='0' y1='0' x2='1' y2='1'>
              <Stop offset='0' stopColor={themeColors.softGold} />
              <Stop offset='1' stopColor={themeColors.darkGold} />
            </LinearGradient>
          </Defs>
          <Rect width={size.width} height={size.height} fill='url(#pillGold)' />
        </Svg>
      )}
      <Text numberOfLines={1} style={tw`text-[9px] ${textClass}`}>
        {label}
      </Text>
    </Pressable>
  )
}

export function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
  const isDark = useColorScheme() === 'dark'

  return (
    <View
      style={tw`flex-row items-center p-1 rounded-full ${isDark ? 'bg-very-dark-bg' : 'bg-pill-bg'}`}
    >
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          isDark={isDark}
          onPress={() => onTabChange(tab.id)}
        />
      ))}
    </View>
  )
}
