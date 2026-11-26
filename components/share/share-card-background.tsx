import type { CardTheme } from '@/constants/share-theme'
import { useId } from 'react'
import Svg, { Circle, Defs, LinearGradient, Mask, Pattern, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg'

const TILE = 64

/** The points of an eight-pointed star (two squares turned against each other). */
function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  const points: string[] = []
  for (let i = 0; i < 16; i++) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = (Math.PI / 8) * i - Math.PI / 2
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`)
  }
  return points.join(' ')
}

interface ShareCardBackgroundProps {
  theme: CardTheme
  width: number
  height: number
}

/**
 * The card's ground: the theme's gradient with a pattern of eight-pointed stars that is clear at
 * the edges and fades out towards the middle, so the text always sits on a calm background.
 * Drawn at the real pixel size so the stars stay square on a tall card.
 */
export function ShareCardBackground({ theme, width, height }: ShareCardBackgroundProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  if (width <= 0 || height <= 0) return null

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Defs>
        <LinearGradient id={`ground${id}`} x1='0' y1='0' x2='1' y2='1'>
          <Stop offset='0' stopColor={theme.from} />
          <Stop offset='1' stopColor={theme.to} />
        </LinearGradient>
        <Pattern id={`stars${id}`} width={TILE} height={TILE} patternUnits='userSpaceOnUse'>
          <Polygon points={starPoints(TILE / 2, TILE / 2, 22, 11)} fill='none' stroke={theme.accent} strokeWidth={1} />
          <Circle cx={TILE / 2} cy={TILE / 2} r={4} fill='none' stroke={theme.accent} strokeWidth={1} />
          <Circle cx={0} cy={0} r={3} fill={theme.accent} />
          <Circle cx={TILE} cy={0} r={3} fill={theme.accent} />
          <Circle cx={0} cy={TILE} r={3} fill={theme.accent} />
          <Circle cx={TILE} cy={TILE} r={3} fill={theme.accent} />
        </Pattern>
        {/* black = pattern hidden (middle), white = pattern shown (edges) */}
        <RadialGradient id={`fade${id}`} cx='0.5' cy='0.5' r='0.72'>
          <Stop offset='0' stopColor='#000000' />
          <Stop offset='0.42' stopColor='#000000' />
          <Stop offset='1' stopColor='#FFFFFF' />
        </RadialGradient>
        <Mask id={`mask${id}`} x='0' y='0' width={width} height={height} maskUnits='userSpaceOnUse'>
          <Rect x='0' y='0' width={width} height={height} fill={`url(#fade${id})`} />
        </Mask>
      </Defs>
      <Rect x='0' y='0' width={width} height={height} fill={`url(#ground${id})`} />
      <Rect
        x='0'
        y='0'
        width={width}
        height={height}
        fill={`url(#stars${id})`}
        opacity={theme.patternOpacity}
        mask={`url(#mask${id})`}
      />
    </Svg>
  )
}
