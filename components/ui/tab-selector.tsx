import { useColorScheme } from '@/hooks/use-color-scheme'
import { Pressable, Text, View } from 'react-native'

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
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View className='flex-row gap-3'>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const bgColor = isActive
          ? 'bg-bright-gold'
          : isDark
            ? 'bg-very-dark-nav-bg'
            : 'bg-very-light-grayish-bg'
        const textColor = isActive
          ? 'text-dark-text'
          : isDark
            ? 'text-light-grayish-text'
            : 'text-dark-grayish-text'

        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-full ${bgColor}`}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Text className={`text-sm font-semibold ${textColor}`}>
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
