import { FEEDBACK_ON_EVERY_TAP } from '@/constants/tasbih-config'
import type { RootState } from '@/redux/store'
import { setAudioModeAsync, useAudioPlayer, type AudioPlayer } from 'expo-audio'
import * as Haptics from 'expo-haptics'
import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

const play = (player: AudioPlayer) => {
  try {
    player.seekTo(0)
    player.play()
  } catch {
    // sound is a nice-to-have, never break counting
  }
}

/**
 * Sound + vibration for the counter, following the two toggles on the Tasbih screen.
 *  - tap():           light tick on a normal count
 *  - targetReached(): stronger vibration + chime (the screen calls it for the 3 counts at the target)
 */
export function useTasbihFeedback() {
  const soundEnabled = useSelector((s: RootState) => s.tasbih.soundEnabled)
  const vibrationEnabled = useSelector((s: RootState) => s.tasbih.vibrationEnabled)

  const tapPlayer = useAudioPlayer(require('../assets/sounds/tap.wav'))
  const donePlayer = useAudioPlayer(require('../assets/sounds/complete.wav'))

  // Don't pause the user's music/Quran recitation while counting
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(() => {})
  }, [])

  const tap = useCallback(() => {
    if (!FEEDBACK_ON_EVERY_TAP) return
    if (vibrationEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (soundEnabled) play(tapPlayer)
  }, [vibrationEnabled, soundEnabled, tapPlayer])

  const targetReached = useCallback(() => {
    if (vibrationEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    if (soundEnabled) play(donePlayer)
  }, [vibrationEnabled, soundEnabled, donePlayer])

  return { tap, targetReached }
}
