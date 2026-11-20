import { getArabicFont, type ArabicFontId } from '@/constants/arabic-fonts'
import type { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

/** The font the user picked for Arabic text (or `override`, e.g. to preview an option). */
export function useArabicFont(override?: ArabicFontId) {
  const selected = useSelector((state: RootState) => state.settings.arabicFont)
  return getArabicFont(override ?? selected)
}
