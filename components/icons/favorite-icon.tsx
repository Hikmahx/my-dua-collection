import React from 'react'
import Svg, { Path } from 'react-native-svg'

export default function FavoriteIcon({
  color = '#2B3032',
  size = 24,
  filled = false,
}: {
  color?: string
  size?: number
  filled?: boolean
}) {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
        <Path
          d='M7 3C4.23858 3 2 5.21619 2 7.95C2 10.157 2.87466 15.3947 11.4875 20.6903C11.7994 20.8821 12.2006 20.8821 12.5125 20.6903C21.1253 15.3947 22 10.157 22 7.95C22 5.21619 19.7614 3 17 3C14.2386 3 12 6 12 6C12 6 9.76142 3 7 3Z'
          fill={String(color)}
        />
      </Svg>
    )
  }

  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M7 3C4.23858 3 2 5.21619 2 7.95C2 10.157 2.87466 15.3947 11.4875 20.6903C11.7994 20.8821 12.2006 20.8821 12.5125 20.6903C21.1253 15.3947 22 10.157 22 7.95C22 5.21619 19.7614 3 17 3C14.2386 3 12 6 12 6C12 6 9.76142 3 7 3Z'
        stroke={String(color)}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  )
}
