import { CARD_EXPORT_WIDTH } from '@/constants/share-config'
import * as MediaLibrary from 'expo-media-library'
import * as Sharing from 'expo-sharing'
import type { RefObject } from 'react'
import type { View } from 'react-native'
import { captureRef } from 'react-native-view-shot'

export interface CardSize {
  width: number
  height: number
}

/**
 * Takes a picture of the card and returns the file's uri (a temporary PNG). The card on screen is
 * only a few hundred px wide, so the picture is scaled up to CARD_EXPORT_WIDTH (1080px) for sharp text.
 */
export async function captureCard(ref: RefObject<View | null>, size: CardSize): Promise<string> {
  if (!ref.current || size.width <= 0) throw new Error('The card is not ready yet')
  const scale = CARD_EXPORT_WIDTH / size.width
  return captureRef(ref, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
    width: CARD_EXPORT_WIDTH,
    height: Math.round(size.height * scale),
  })
}

/** Saves the picture in the device's photos. 'denied' when the user did not allow it. */
export async function savePictureToPhotos(uri: string): Promise<'saved' | 'denied'> {
  // true = only asks to add pictures, never to read the user's photos
  const { granted } = await MediaLibrary.requestPermissionsAsync(true)
  if (!granted) return 'denied'
  await MediaLibrary.saveToLibraryAsync(uri)
  return 'saved'
}

/** Opens the system share sheet with the picture. False when this device cannot share files. */
export async function sharePictureWithSystemSheet(uri: string, dialogTitle: string): Promise<boolean> {
  if (!(await Sharing.isAvailableAsync())) return false
  await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle })
  return true
}
