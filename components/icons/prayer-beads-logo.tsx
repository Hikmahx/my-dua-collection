import { PRAYER_BEADS_PATH } from '@/constants/prayer-beads-path'
import Svg, { Path } from 'react-native-svg'

// Prayer-beads logo, drawn from assets/images/prayer-beads.svg (113 x 113 artwork). The outline is in constants/prayer-beads-path.ts.

interface PrayerBeadsLogoProps {
  /** Width and height in px. 113 = the artwork's own size. */
  size?: number
  color?: string
}

export function PrayerBeadsLogo({ size = 113, color = '#C2A462' }: PrayerBeadsLogoProps) {
  return (
    <Svg width={size} height={size} viewBox='0 0 113 113' fill='none'>
      <Path d={PRAYER_BEADS_PATH} fill={color} />
    </Svg>
  )
}
