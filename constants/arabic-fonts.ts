import { Almarai_400Regular } from '@expo-google-fonts/almarai'
import { Amiri_400Regular } from '@expo-google-fonts/amiri'
import { Cairo_400Regular } from '@expo-google-fonts/cairo'
import { IBMPlexSansArabic_400Regular } from '@expo-google-fonts/ibm-plex-sans-arabic'
import { NotoNaskhArabic_400Regular } from '@expo-google-fonts/noto-naskh-arabic'

export type ArabicFontId = 'amiri' | 'ibm-plex-sans-arabic' | 'cairo' | 'almarai' | 'noto-naskh-arabic'

export interface ArabicFontOption {
  id: ArabicFontId
  label: string
  /** The name the font is registered under (see ARABIC_FONT_ASSETS) and used as fontFamily. */
  family: string
}

/** The Arabic text styles, in the order the picker shows them. */
export const ARABIC_FONT_OPTIONS: readonly ArabicFontOption[] = [
  { id: 'noto-naskh-arabic', label: 'Noto Naskh Arabic', family: 'NotoNaskhArabic_400Regular' },
  { id: 'amiri', label: 'Amiri', family: 'Amiri_400Regular' },
  { id: 'ibm-plex-sans-arabic', label: 'IBM Plex Sans Arabic', family: 'IBMPlexSansArabic_400Regular' },
  { id: 'cairo', label: 'Cairo', family: 'Cairo_400Regular' },
  { id: 'almarai', label: 'Almarai', family: 'Almarai_400Regular' },
]

export const DEFAULT_ARABIC_FONT: ArabicFontId = 'noto-naskh-arabic'

/** Passed to useFonts in app/_layout.tsx so every option is ready (the picker previews each one). */
export const ARABIC_FONT_ASSETS = {
  Amiri_400Regular,
  IBMPlexSansArabic_400Regular,
  Cairo_400Regular,
  Almarai_400Regular,
  NotoNaskhArabic_400Regular,
}

export const isArabicFontId = (value: unknown): value is ArabicFontId =>
  ARABIC_FONT_OPTIONS.some((option) => option.id === value)

export const getArabicFont = (id: ArabicFontId): ArabicFontOption =>
  ARABIC_FONT_OPTIONS.find((option) => option.id === id) ?? ARABIC_FONT_OPTIONS[0]
