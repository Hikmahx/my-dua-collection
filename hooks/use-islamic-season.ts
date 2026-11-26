import { useToday } from '@/hooks/use-today'
import { getIslamicSeason, type IslamicSeason } from '@/lib/islamic-season'
import type { RootState } from '@/redux/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/**
 * Where we are in the Islamic year today: Ramadan, Dhul Hijjah, the days until the next one, whether today is the 1st
 * of Ramadan or an Eid. It follows the "Hijri date adjustment" of Settings and updates by itself at midnight.
 */
export function useIslamicSeason(): IslamicSeason {
  const adjustment = useSelector((state: RootState) => state.settings.hijriAdjustment)
  const today = useToday()
  // `today` is only here so the season is worked out again when the day changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => getIslamicSeason(new Date(), adjustment), [adjustment, today])
}
