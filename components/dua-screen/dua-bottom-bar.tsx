import { TapCounter } from '@/components/ui/tap-counter'
import { useDuaScreenColors } from '@/hooks/use-dua-screen-colors'
import { Feather } from '@expo/vector-icons'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const BAR_HEIGHT = 80
const COUNTER_SIZE = 94

// Where each icon is centred, as a share of the screen width (measured on the design)
const ICON_POSITIONS = { play: 8, heart: 28.3, share: 75.7, info: 89.3 }

interface DuaBottomBarProps {
  /** What the counter shows: the taps still to go, and how far along the arc is. */
  remaining: number
  progress: number
  onTap: () => void
  isFavorite: boolean
  onPlay: () => void
  onToggleFavorite: () => void
  onShare: () => void
  onInfo: () => void
}

function BarIcon({
  name,
  position,
  color,
  label,
  onPress,
}: {
  name: 'play' | 'heart' | 'share-2' | 'info'
  /** Centre of the icon as a % of the bar's width. */
  position: number
  color: string
  label: string
  onPress: () => void
}) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${position}%`,
        width: 44,
        marginLeft: -22,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Pressable onPress={onPress} hitSlop={10} accessibilityRole='button' accessibilityLabel={label}>
        <Feather name={name} size={24} color={color} />
      </Pressable>
    </View>
  )
}

/**
 * The bottom bar: audio and favorite on the left, share and info on the right, and the counter in
 * the middle, sitting half over the bar. The counter counts down to 0 for this dua. The icons sit at
 * fixed shares of the width, so they stay where the design has them on any screen.
 */
export function DuaBottomBar({
  remaining,
  progress,
  onTap,
  isFavorite,
  onPlay,
  onToggleFavorite,
  onShare,
  onInfo,
}: DuaBottomBarProps) {
  const c = useDuaScreenColors()
  const insets = useSafeAreaInsets()
  const barHeight = BAR_HEIGHT + insets.bottom

  return (
    // as tall as the bar plus the half of the counter above it, so the whole counter takes touches
    <View style={{ height: barHeight + COUNTER_SIZE / 2 }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: barHeight,
          paddingBottom: insets.bottom,
          backgroundColor: c.bar,
        }}
      >
        <View style={{ height: BAR_HEIGHT }}>
          <BarIcon name='play' position={ICON_POSITIONS.play} color={c.icon} label='Play audio' onPress={onPlay} />
          <BarIcon
            name='heart'
            position={ICON_POSITIONS.heart}
            color={isFavorite ? c.favorite : c.icon}
            label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onPress={onToggleFavorite}
          />
          <BarIcon name='share-2' position={ICON_POSITIONS.share} color={c.icon} label='Share' onPress={onShare} />
          <BarIcon name='info' position={ICON_POSITIONS.info} color={c.icon} label='Dua virtue' onPress={onInfo} />
        </View>
      </View>

      <View style={{ position: 'absolute', top: 0, alignSelf: 'center' }}>
        <TapCounter
          value={remaining}
          progress={progress}
          onTap={onTap}
          size={COUNTER_SIZE}
          colors={c}
          accessibilityLabel={`${remaining} left. Tap to count down`}
        />
      </View>
    </View>
  )
}
