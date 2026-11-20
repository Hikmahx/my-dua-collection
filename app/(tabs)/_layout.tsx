import { useT } from '@/hooks/use-t'
import { Tabs } from 'expo-router'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { HapticTab } from '@/components/haptic-tab'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import tw from '@/lib/tailwind'

import ExploreIcon from '@/components/icons/explore-icon'
import FavoriteIcon from '@/components/icons/favorite-icon'
import SettingsIcon from '@/components/icons/settings-icon'
import TasbihIcon from '@/components/icons/tasbih-icon'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const insets = useSafeAreaInsets()
  const t = useT()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: { backgroundColor: colors.screenBackground },
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 56 + insets.bottom,
          paddingTop: 10,
          elevation: 0,
        },
        // font size follows the user's accessibility font setting automatically
        tabBarLabelStyle: [tw`font-nunito`, { fontSize: 12 }],
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={size ?? 28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='explore'
        options={{
          title: t('tabs.explore'),
          tabBarIcon: ({ focused, color, size }) => (
            <ExploreIcon color={color} size={size ?? 20} />
          ),
        }}
      />

      <Tabs.Screen
        name='tasbih'
        options={{
          title: t('tabs.tasbih'),
          tabBarIcon: ({ focused, color, size }) => (
            <TasbihIcon color={color} size={size ?? 20} />
          ),
        }}
      />

      <Tabs.Screen
        name='favorites'
        options={{
          title: t('tabs.favorites'),
          tabBarIcon: ({ focused, color, size }) => (
            <FavoriteIcon color={color} size={size ?? 20} filled={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name='settings'
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ focused, color, size }) => (
            <SettingsIcon color={color} size={size ?? 20} />
          ),
        }}
      />
    </Tabs>
  )
}
