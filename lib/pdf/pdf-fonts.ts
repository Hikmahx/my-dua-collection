import { ARABIC_FONT_ASSETS, getArabicFont, type ArabicFontId } from '@/constants/arabic-fonts'
import type { PdfFonts } from '@/lib/pdf/collection-pdf-html'
import { BerkshireSwash_400Regular } from '@expo-google-fonts/berkshire-swash'
import {
  NunitoSans_400Regular,
  NunitoSans_700Bold,
  NunitoSans_700Bold_Italic,
} from '@expo-google-fonts/nunito-sans'
import { Asset } from 'expo-asset'
import * as FileSystem from 'expo-file-system/legacy'
import { Platform } from 'react-native'

/**
 * The PDF is made from HTML, and the HTML has to carry its fonts: the web view that prints it knows nothing
 * about the fonts the app loaded. So each font file is read once and kept as base64 text, to be written into
 * the document as an @font-face (see collection-pdf-html.ts).
 */
const cache = new Map<number, Promise<string>>()

/** In a browser the font is a URL: it is fetched and turned into base64 (there are no files to read). */
async function readUrlAsBase64(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob()
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function readFontAsBase64(module: number): Promise<string> {
  const cached = cache.get(module)
  if (cached) return cached

  const loading = (async () => {
    const asset = Asset.fromModule(module)
    if (Platform.OS === 'web') return readUrlAsBase64(asset.uri)
    if (!asset.localUri) await asset.downloadAsync()
    const uri = asset.localUri ?? asset.uri
    return FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
  })()

  // a failed read is not kept, so the next export tries again
  loading.catch(() => cache.delete(module))
  cache.set(module, loading)
  return loading
}

/** Loads every font the PDF uses: Berkshire Swash, Nunito Sans, and the Arabic font chosen in Settings. */
export async function loadPdfFonts(arabicFont: ArabicFontId): Promise<PdfFonts> {
  const arabicFamily = getArabicFont(arabicFont).family as keyof typeof ARABIC_FONT_ASSETS
  const [berkshire, nunito, nunitoBold, nunitoBoldItalic, arabic] = await Promise.all([
    readFontAsBase64(BerkshireSwash_400Regular),
    readFontAsBase64(NunitoSans_400Regular),
    readFontAsBase64(NunitoSans_700Bold),
    readFontAsBase64(NunitoSans_700Bold_Italic),
    readFontAsBase64(ARABIC_FONT_ASSETS[arabicFamily]),
  ])
  return { berkshire, nunito, nunitoBold, nunitoBoldItalic, arabic }
}
