import React from 'react'
import Svg, { Path } from 'react-native-svg'

const GOLD = '#C2A462'

export function CameraIcon({
  color = GOLD,
  size = 24,
}: {
  color?: string
  size?: number
}) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  )
}

export function SparkleIcon({
  color = GOLD,
  size = 24,
}: {
  color?: string
  size?: number
}) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M12 3L13.5 9.75L20 11.25L13.5 12.75L12 19.5L10.5 12.75L4 11.25L10.5 9.75L12 3Z'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M18 5L18.75 7.5L21 8.25L18.75 9L18 11.5L17.25 9L15 8.25L17.25 7.5L18 5Z'
        stroke={color}
        strokeWidth={1}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M6 15L6.75 17.25L9 18L6.75 18.75L6 21L5.25 18.75L3 18L5.25 17.25L6 15Z'
        stroke={color}
        strokeWidth={1}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  )
}

export function FormIcon({
  color = GOLD,
  size = 24,
}: {
  color?: string
  size?: number
}) {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M14 2V8H20'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M16 13H8'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M16 17H8'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M10 9H9H8'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  )
}
