import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { BerkshireSwash_400Regular } from '@expo-google-fonts/berkshire-swash'
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from '@expo-google-fonts/nunito-sans'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { Appearance } from 'react-native'
import 'react-native-reanimated'
import { Provider, useDispatch, useSelector } from 'react-redux'

import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { loadThemePreference, saveThemePreference } from '@/lib/settings-storage'
import { setTheme } from '@/redux/reducers/settingsSlice'
import store, { RootState } from '@/redux/store'

SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  )
}

function AppShell() {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.settings.theme)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const [themeReady, setThemeReady] = useState(false)

  // Load fonts once for the whole app (tab bar labels need them too)
  const [fontsLoaded] = useFonts({
    BerkshireSwash_400Regular,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  })

  // 1) Restore the saved theme (dark when nothing was saved) before showing anything,
  //    so there is no light/dark flash on launch.
  useEffect(() => {
    let active = true
    loadThemePreference().then((saved) => {
      if (!active) return
      const initial = saved ?? 'dark'
      Appearance.setColorScheme(initial)
      dispatch(setTheme(initial))
      setThemeReady(true)
    })
    return () => {
      active = false
    }
  }, [dispatch])

  // 2) Apply + save every later change (from the filter menu on Home)
  useEffect(() => {
    if (!themeReady) return
    Appearance.setColorScheme(theme)
    saveThemePreference(theme)
  }, [theme, themeReady])

  const ready = fontsLoaded && themeReady
  useEffect(() => {
    if (ready) SplashScreen.hideAsync()
  }, [ready])

  if (!ready) return null

  const base = isDark ? DarkTheme : DefaultTheme
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: Colors[isDark ? 'dark' : 'light'].screenBackground,
    },
  }

  return (
    <ThemeProvider value={navTheme}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='modal'
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
      <StatusBar style='auto' />
    </ThemeProvider>
  )
}
