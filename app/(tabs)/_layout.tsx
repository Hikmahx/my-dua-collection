import { Tabs } from 'expo-router'
import React from 'react'

import { HapticTab } from '@/components/haptic-tab'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import ExploreIcon from '@/components/icons/ExploreIcon'
import FavoriteIcon from '@/components/icons/FavoriteIcon'
import SettingsIcon from '@/components/icons/SettingsIcon'
import TasbihIcon from '@/components/icons/TasbihIcon'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
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
          title: 'Explore',
          tabBarIcon: ({ focused, color, size }) => (
            <ExploreIcon color={color} size={size ?? 20} />
          ),
        }}
      />

      <Tabs.Screen
        name='tasbih'
        options={{
          title: 'Tasbih',
          tabBarIcon: ({ focused, color, size }) => (
            <TasbihIcon color={color} size={size ?? 20} />
          ),
        }}
      />

      <Tabs.Screen
        name='favorites'
        options={{
          title: 'Favorites',
          tabBarIcon: ({ focused, color, size }) => (
            <FavoriteIcon color={color} size={size ?? 20} filled={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color, size }) => (
            <SettingsIcon color={color} size={size ?? 20} />
          ),
        }}
      />
    </Tabs>
  )
}
