import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import { tasbihProgress } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import { Pressable, Text, useWindowDimensions, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

// Geometry in "design units": a 200 x 200 box, drawn at 375pt wide screens
const BOX = 200
const C = BOX / 2
const OUTER_R = 90 // outer disc
const INNER_R = 79 // number disc
const ARC_R = 91 // gold progress arc, hugging the disc's edge
const ARC_W = 5
const KNOB_R = 5.5

interface TasbihCounterProps {
  count: number
  target: number
  onTap: () => void
}

/** The big tappable ring: count in the middle, gold arc showing progress towards the target. */
export function TasbihCounter({ count, target, onTap }: TasbihCounterProps) {
  const c = useTasbihColors()
  const { width } = useWindowDimensions()
  const size = Math.min((BOX * width) / 375, 260)
  const s = size / BOX

  const progress = tasbihProgress(count, target)
  const circumference = 2 * Math.PI * ARC_R

  return (
    <Pressable
      // onPressIn so fast tapping never feels laggy
      onPressIn={onTap}
      accessibilityRole='button'
      accessibilityLabel={`Count. ${count} of ${target}. Tap to count`}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      {/* soft shadow under the disc (SVG can't do shadows) */}
      <View
        style={{
          position: 'absolute',
          width: OUTER_R * 2 * s,
          height: OUTER_R * 2 * s,
          borderRadius: OUTER_R * s,
          backgroundColor: c.ringOuter,
          shadowColor: c.ringShadow,
          shadowOpacity: c.ringShadowOpacity,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          elevation: 8,
        }}
      />
      <Svg width={size} height={size} viewBox={`0 0 ${BOX} ${BOX}`} style={tw`absolute`}>
        <Circle cx={C} cy={C} r={OUTER_R} fill={c.ringOuter} />
        <Circle cx={C} cy={C} r={INNER_R} fill={c.ringInner} />
        {progress > 0 && (
          <Circle
            cx={C}
            cy={C}
            r={ARC_R}
            fill='none'
            stroke={c.arc}
            strokeWidth={ARC_W}
            strokeLinecap='round'
            strokeDasharray={`${circumference * progress} ${circumference}`}
            rotation={-90}
            originX={C}
            originY={C}
          />
        )}
        {/* knob marking the start (12 o'clock) of the arc */}
        <Circle
          cx={C}
          cy={C - ARC_R}
          r={KNOB_R}
          fill={c.knobFill}
          stroke={c.arc}
          strokeWidth={1.8}
        />
      </Svg>

      <View style={{ alignItems: 'center', marginTop: -3 * s }}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            tw`font-nunito text-center`,
            {
              color: c.number,
              fontSize: 56 * s,
              lineHeight: 60 * s,
              width: INNER_R * 1.6 * s,
            },
          ]}
        >
          {count}
        </Text>
        <Text
          style={[
            tw`font-nunito-semibold`,
            { color: c.caption, fontSize: 10 * s, lineHeight: 12 * s, letterSpacing: 1.5, marginTop: 9 * s },
          ]}
        >
          OF {target}
        </Text>
        <Text
          style={[
            tw`font-nunito`,
            { color: c.caption, fontSize: 9.5 * s, lineHeight: 12 * s, marginTop: 1.5 * s },
          ]}
        >
          Tap to count
        </Text>
      </View>
    </Pressable>
  )
}
