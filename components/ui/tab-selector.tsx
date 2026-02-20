import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
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
  const isDark = useColorScheme() === 'dark'

  return (
    <View style={tw`flex-row items-center gap-3`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const bgClass = isActive ? 'bg-soft-gold' : 'bg-transparent'
        const paddingClass = isActive ? 'px-4' : 'px-2'
        const textClass = isActive
          ? 'text-dark-text'
          : isDark
            ? 'text-light-grayish-text-muted'
            : 'text-dark-grayish-text'
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={({ pressed }) => [
              tw`py-2 rounded-full ${bgClass} ${paddingClass}`,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={tw`text-sm font-semibold ${textClass}`}>{tab.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}
