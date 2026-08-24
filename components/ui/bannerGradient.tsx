import { themeColors } from '@/constants/themeColors'
import React from 'react'
import { Defs, LinearGradient, Rect, Stop, Svg, SvgProps } from 'react-native-svg'

const { darkEmerald, softEmerald } = themeColors

const viewBox = { width: 315, height: 150 }
const cornerRadius = 22

/**
 * Gradient only – for the card background layer. Uses theme (tailwind) colors.
 */
export function BannerGradient(props: SvgProps) {
  return (
    <Svg
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      {...props}
    >
      <Defs>
        <LinearGradient
          id="cardGradient"
          x1="315"
          y1="150"
          x2="-96.4781"
          y2="83.1348"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={darkEmerald} />
          <Stop offset="1" stopColor={softEmerald} />
        </LinearGradient>
      </Defs>
      <Rect
        width={viewBox.width}
        height={viewBox.height}
        rx={cornerRadius}
        ry={cornerRadius}
        fill="url(#cardGradient)"
      />
    </Svg>
  )
}
