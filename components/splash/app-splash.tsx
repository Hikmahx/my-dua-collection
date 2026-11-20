import SplashBackground from '@/assets/images/splash-background.svg'
import { SPLASH } from '@/constants/splash-config'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet } from 'react-native'

interface AppSplashProps {
  /** True once everything the app needs (fonts, saved settings, ...) has loaded. */
  ready: boolean
  /** Called after the fade-out, so the parent can unmount the splash. */
  onFinish: () => void
}

/**
 * Full-screen splash shown over the app while it loads: the prayer-mat artwork, the beads logo
 * and the app name. The artwork covers the screen (like resizeMode "cover") and the logo and
 * name are placed with the same scale, so they always stay lined up with it.
 *
 * Dark only, by design. The native splash (app.json) is just the matching background colour,
 * so there is no flash when this takes over.
 */
export function AppSplash({ ready, onFinish }: AppSplashProps) {
  const { designWidth, designHeight } = SPLASH

    // design px -> screen px, same maths as resizeMode="cover" (centred)
  // const scale = Math.max(width / designWidth, height / designHeight)
  // const toX = (x: number) => (x - designWidth / 2) * scale + width / 2
  // const toY = (y: number) => (y - designHeight / 2) * scale + height / 2

  const contentOpacity = useRef(new Animated.Value(0)).current // artwork, logo, name
  const overlayOpacity = useRef(new Animated.Value(1)).current // the whole splash
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)

  useEffect(() => {
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: SPLASH.fadeInMs,
      useNativeDriver: true,
    }).start()
    const timer = setTimeout(() => setMinTimeElapsed(true), SPLASH.minDurationMs)
    return () => clearTimeout(timer)
  }, [contentOpacity])

  useEffect(() => {
    if (!ready || !minTimeElapsed) return
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: SPLASH.fadeOutMs,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onFinish()
    })
  }, [ready, minTimeElapsed, overlayOpacity, onFinish])

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: SPLASH.background, opacity: overlayOpacity, zIndex: 100 },
      ]}
    >
      <StatusBar style='light' />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: contentOpacity }]}>
        {/* 'slice' = cover: same scaling as toX / toY below, so the logo stays lined up */}
        <SplashBackground
          width='100%'
          height='100%'
          viewBox={`0 0 ${designWidth} ${designHeight}`}
          preserveAspectRatio='xMidYMid slice'
          style={StyleSheet.absoluteFill}
        />

        {/* <View style={{ position: 'absolute', left: toX(logo.x), top: toY(logo.y) }}>
          <PrayerBeadsLogo size={logo.size * scale} color={logo.color} />
        </View>

        <Text
          style={[
            tw`font-berkshire text-center`,
            {
              position: 'absolute',
              left: toX(title.centerX - 150),
              width: 300 * scale,
              top: toY(title.top),
              fontSize: title.fontSize * scale,
              lineHeight: title.lineHeight * scale,
              color: title.color,
              includeFontPadding: false,
            },
          ]}
        >
          {title.text}
        </Text> */}
      </Animated.View>
    </Animated.View>
  )
}
