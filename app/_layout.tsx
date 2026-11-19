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
import 'react-native-reanimated'
import { Provider, useDispatch, useSelector } from 'react-redux'

import { AppSplash } from '@/components/splash/app-splash'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useSettingsPersistence } from '@/hooks/use-settings-persistence'
import { useUserPersistence } from '@/hooks/use-user-persistence'
import { useTasbihPersistence } from '@/hooks/use-tasbih-persistence'
import { loadCachedDuas, saveCachedDuas } from '@/lib/duas-storage'
import { setDuas } from '@/redux/reducers/duasSlice'
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
  const duas = useSelector((state: RootState) => state.duas.items)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
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

  // 1) Restore the saved settings (theme, font sizes, ...) before showing anything, and save
  //    every later change. The theme is applied right away, so there is no light/dark flash.
  const settingsReady = useSettingsPersistence()

  // 2) Restore the cached duas (falls back to data/dua.json on first launch),
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

  // 3) Restore / save the Tasbih counter (count, target, selected dua, sound, vibration)
  const tasbihReady = useTasbihPersistence()

  // 4) Restore / save who is signed in, their name and avatar (or the guest profile)
  const userReady = useUserPersistence()

  const ready = fontsLoaded && settingsReady && duasReady && tasbihReady && userReady

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
            <Stack.Screen name='collection/[id]' options={{ headerShown: false }} />
            <Stack.Screen name='dua/[id]' options={{ headerShown: false }} />
            <Stack.Screen name='profile' options={{ headerShown: false }} />
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
