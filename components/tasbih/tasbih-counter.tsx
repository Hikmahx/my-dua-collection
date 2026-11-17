import { TapCounter } from '@/components/ui/tap-counter'
import { useTasbihColors } from '@/hooks/use-tasbih-colors'
import { tasbihProgress } from '@/lib/tasbih-utils'
import { useWindowDimensions } from 'react-native'

interface TasbihCounterProps {
  count: number
  target: number
  onTap: () => void
  /** Increase by 1 to shake the circle once (restarts if it is already shaking). */
  shakeSignal?: number
}

/** The big counter of the Tasbih screen: counts up towards the target. */
export function TasbihCounter({ count, target, onTap, shakeSignal }: TasbihCounterProps) {
  const colors = useTasbihColors()
  const { width } = useWindowDimensions()

  return (
    <TapCounter
      value={count}
      progress={tasbihProgress(count, target)}
      onTap={onTap}
      size={Math.min((200 * width) / 375, 260)}
      colors={colors}
      caption={{ top: `OF ${target}`, bottom: 'Tap to count' }}
      shakeSignal={shakeSignal}
      accessibilityLabel={`Count. ${count} of ${target}. Tap to count`}
    />
  )
}
