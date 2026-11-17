import tw from '@/lib/tailwind'
import { useEffect, useRef } from 'react'
import { Animated, Pressable, Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

// Geometry in "design units": a 200 x 200 box, scaled to `size`
const BOX = 200
const C = BOX / 2
const OUTER_R = 90 // outer disc
const INNER_R = 79 // number disc
const ARC_R = 91 // gold progress arc, hugging the disc's edge
const ARC_W = 5
const KNOB_R = 5.5

// Side-to-side shake (px at the design size), each step takes SHAKE_STEP_MS
const SHAKE_OFFSETS = [-8, 8, -6, 6, -3, 0]
const SHAKE_STEP_MS = 45

export interface TapCounterColors {
  ringOuter: string
  ringInner: string
  ringShadow: string
  ringShadowOpacity: number
  arc: string
  knobFill: string
  number: string
  caption: string
}

interface TapCounterProps {
  /** The number in the middle (a count that goes up, or one that counts down). */
  value: number
  /** 0 to 1: how much of the gold arc is drawn. */
  progress: number
  onTap: () => void
  /** Width and height in px. */
  size: number
  colors: TapCounterColors
  /** Two small lines under the number, e.g. "OF 100" and "Tap to count". Left out by default. */
  caption?: { top: string; bottom: string }
  /** Increase by 1 to shake the circle once (restarts if it is already shaking). */
  shakeSignal?: number
  accessibilityLabel: string
}

/**
 * The tappable ring: a number in the middle and a gold arc for progress. It only draws what it is
 * given, so the same ring serves the Tasbih screen (counts up) and the Dua screen (counts down).
 */
export function TapCounter({
  value,
  progress,
  onTap,
  size,
  colors: c,
  caption,
  shakeSignal = 0,
  accessibilityLabel,
}: TapCounterProps) {
  const s = size / BOX

  const shakeX = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (!shakeSignal) return
    shakeX.stopAnimation()
    shakeX.setValue(0)
    Animated.sequence(
      SHAKE_OFFSETS.map((x) =>
        Animated.timing(shakeX, { toValue: x * s, duration: SHAKE_STEP_MS, useNativeDriver: true }),
      ),
    ).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shakeSignal])

  const circumference = 2 * Math.PI * ARC_R

  return (
    <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
      <Pressable
        // onPressIn so fast tapping never feels laggy
        onPressIn={onTap}
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel}
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
              strokeDasharray={`${circumference * Math.min(1, progress)} ${circumference}`}
              rotation={-90}
              originX={C}
              originY={C}
            />
          )}
          {/* knob marking the start (12 o'clock) of the arc */}
          <Circle cx={C} cy={C - ARC_R} r={KNOB_R} fill={c.knobFill} stroke={c.arc} strokeWidth={1.8} />
        </Svg>

        <View style={{ alignItems: 'center', marginTop: caption ? -3 * s : 0 }}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              tw`font-nunito text-center`,
              { color: c.number, fontSize: 56 * s, lineHeight: 60 * s, width: INNER_R * 1.6 * s },
            ]}
          >
            {value}
          </Text>
          {caption && (
            <>
              <Text
                style={[
                  tw`font-nunito-semibold`,
                  { color: c.caption, fontSize: 10 * s, lineHeight: 12 * s, letterSpacing: 1.5, marginTop: 9 * s },
                ]}
              >
                {caption.top}
              </Text>
              <Text
                style={[
                  tw`font-nunito`,
                  { color: c.caption, fontSize: 9.5 * s, lineHeight: 12 * s, marginTop: 1.5 * s },
                ]}
              >
                {caption.bottom}
              </Text>
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  )
}
