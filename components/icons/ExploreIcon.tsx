import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

export default function ExploreIcon({
  color = '#000',
  size = 18,
}: {
  color?: string
  size?: number
}) {
  return (
    <Svg width={size} height={size} viewBox='0 0 18 18' fill='none'>
      <Circle
        cx='8.24047'
        cy='8.24047'
        r='7.49047'
        stroke={String(color)}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M13.4502 13.8394L16.3869 16.7684'
        stroke={String(color)}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  )
}
