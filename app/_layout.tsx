import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { Amiri_400Regular } from '@expo-google-fonts/amiri'
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

import { AppSplash } from '@/components/splash/app-splash'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useTasbihPersistence } from '@/hooks/use-tasbih-persistence'
import { loadCachedDuas, saveCachedDuas } from '@/lib/duas-storage'
import { loadThemePreference, saveThemePreference } from '@/lib/settings-storage'
import { setDuas } from '@/redux/reducers/duasSlice'
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
  const duas = useSelector((state: RootState) => state.duas.items)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const [themeReady, setThemeReady] = useState(false)
  const [duasReady, setDuasReady] = useState(false)
  const [splashDone, setSplashDone] = useState(false)

  // Load fonts once for the whole app (tab bar labels need them too)
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
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
      Appearance.setColorScheme?.(initial) // not available on web
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
    Appearance.setColorScheme?.(theme)
    saveThemePreference(theme)
  }, [theme, themeReady])

  // 3) Restore the cached duas (falls back to data/data.json on first launch),
  //    then save every later change (add, remove, favorite, ...).
  useEffect(() => {
    let active = true
    loadCachedDuas().then((cached) => {
      if (!active) return
      if (cached) dispatch(setDuas(cached))
      setDuasReady(true)
    })
    return () => {
      active = false
    }
  }, [dispatch])

  useEffect(() => {
    if (!duasReady) return
    saveCachedDuas(duas)
  }, [duas, duasReady])

  // 4) Restore / save the Tasbih counter (count, target, selected dua, sound, vibration)
  const tasbihReady = useTasbihPersistence()

  const ready = fontsLoaded && themeReady && duasReady && tasbihReady

  // The native splash (just a background colour, see app.json) only has to cover font loading.
  // After that, <AppSplash /> takes over until the app is ready, then fades out.
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  const base = isDark ? DarkTheme : DefaultTheme
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: Colors[isDark ? 'dark' : 'light'].screenBackground,
    },
  }

  return (
    <>
      {ready && (
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
      )}
      {!splashDone && <AppSplash ready={ready} onFinish={() => setSplashDone(true)} />}
    </>
  )
}
