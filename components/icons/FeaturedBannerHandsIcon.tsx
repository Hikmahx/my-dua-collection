import React from 'react'
import Svg, { Path } from 'react-native-svg'

/** White hands-in-prayer icon for the featured dua banner (on green background). */
export default function FeaturedBannerHandsIcon({
  size = 20,
  color = 'white',
}: {
  size?: number
  color?: string
}) {
  return (
    <Svg width={size} height={size} viewBox='0 0 20 20' fill='none'>
      <Path
        d='M16.3636 10.9095L13.6364 13.6368M16.3636 10.9095V7.27317C16.3636 5.76694 17.5847 4.5459 19.0909 4.5459V10.1405C19.0909 11.5118 18.5745 12.8327 17.6444 13.8402L15.2562 16.4274C14.2236 17.5461 12.7705 18.1823 11.2482 18.1823H10V15.6115C10 14.0652 10.6563 12.5916 11.8056 11.5572L12.6342 10.8115C13.7056 9.84719 15.3444 9.89028 16.3636 10.9095Z'
        stroke={color}
        strokeWidth={0.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M3.63636 10.9095L6.36364 13.6368M3.63636 10.9095V7.27317C3.63636 5.76694 2.41532 4.5459 0.909091 4.5459V10.1405C0.909091 11.5118 1.42555 12.8327 2.35562 13.8402L4.74379 16.4274C5.77637 17.5461 7.22946 18.1823 8.75181 18.1823H10V15.6115C10 14.0652 9.3437 12.5916 8.19435 11.5572L7.36578 10.8115C6.29436 9.84719 4.65562 9.89028 3.63636 10.9095Z'
        stroke={color}
        strokeWidth={0.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M12.727 5.84951C12.2131 6.70245 11.2779 7.2729 10.2095 7.2729C8.58743 7.2729 7.27246 5.95794 7.27246 4.33584C7.27246 3.26745 7.84291 2.3323 8.69585 1.81836'
        stroke={color}
        strokeWidth={0.5}
        strokeLinecap='round'
      />
      <Path
        d='M10.8184 3.72656H10.8265'
        stroke={color}
        strokeWidth={0.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  )
}
