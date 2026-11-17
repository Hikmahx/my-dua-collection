import {
  BODY_PARTS,
  CAP_PARTS,
  HIJAB_GRADIENT_FACTORS,
  HIJAB_PARTS,
  type AvatarPart,
} from '@/components/avatar/avatar-parts'
import type { AvatarConfig } from '@/constants/avatar-config'
import { scaleColor } from '@/lib/color'
import { useId } from 'react'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'

const ART_WIDTH = 66
const ART_HEIGHT = 58

interface AvatarProps {
  config: AvatarConfig
  /** Width in px. The height follows the artwork (66 x 58). */
  size?: number
}

/**
 * The avatar bust, in the colors from `config`: skin tone, shirt, and a cap (male) or a hijab
 * (female). Draw it inside a round, clipped container to get the profile picture.
 */
export function Avatar({ config, size = 66 }: AvatarProps) {
  const gradientId = `hijab-${useId()}`
  const colors = { skin: config.skin, hair: config.hair, shirt: config.shirt, cap: config.cap, hijab: config.hijab }
  const parts = config.gender === 'female' ? [...BODY_PARTS, ...HIJAB_PARTS] : [...BODY_PARTS, ...CAP_PARTS]

  const fillOf = (part: AvatarPart) => {
    if (part.gradient) return `url(#${gradientId})`
    return scaleColor(colors[part.role], part.factor ?? 1)
  }

  return (
    <Svg width={size} height={(size * ART_HEIGHT) / ART_WIDTH} viewBox={`0 0 ${ART_WIDTH} ${ART_HEIGHT}`}>
      <Defs>
        <LinearGradient id={gradientId} x1={33.5496} y1={44.6878} x2={33.5496} y2={5.08862} gradientUnits='userSpaceOnUse'>
          {HIJAB_GRADIENT_FACTORS.map((factor, index) => (
            <Stop
              key={factor}
              offset={index === 0 ? 0.017 : index === 1 ? 0.533 : 1}
              stopColor={scaleColor(config.hijab, factor)}
            />
          ))}
        </LinearGradient>
      </Defs>
      {parts.map((part, index) => (
        <Path key={index} d={part.d} fill={fillOf(part)} />
      ))}
    </Svg>
  )
}
