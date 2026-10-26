import { darkBanner, themeColors } from '@/constants/themeColors'
import { useColorScheme } from '@/hooks/use-color-scheme'
import React from 'react'
import { Defs, LinearGradient, Rect, Stop, Svg, SvgProps } from 'react-native-svg'

const { darkEmerald, softEmerald } = themeColors

const viewBox = { width: 315, height: 150 }

/**
 * Gradient only – for the card background layer.
 */
export function BannerGradient(props: SvgProps) {
  const isDark = useColorScheme() === 'dark'
  const from = isDark ? darkBanner.from : darkEmerald
  const to = isDark ? darkBanner.to : softEmerald

  return (
    <Svg
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      fill='none'
      preserveAspectRatio='none'
      {...props}
    >
      <Defs>
        <LinearGradient
          id='cardGradient'
          x1='315'
          y1='150'
          x2='-96.4781'
          y2='83.1348'
          gradientUnits='userSpaceOnUse'
        >
          <Stop stopColor={from} />
          <Stop offset='1' stopColor={to} />
        </LinearGradient>
      </Defs>
      <Rect width={viewBox.width} height={viewBox.height} fill='url(#cardGradient)' />
    </Svg>
  )
}
