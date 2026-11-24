import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'

export type PickedImage =
  | { status: 'picked'; uri: string }
  | { status: 'cancelled' }
  /** The camera permission was refused. */
  | { status: 'denied' }

/** Pictures wider than this are shrunk before they are sent (a phone photo is several MB and OCR does not need it). */
const MAX_WIDTH = 1600

/**
 * Opens the camera (its own viewfinder) or the photo library and returns the chosen picture, shrunk and saved as a
 * JPEG. The photo library needs no permission; the camera asks for it the first time.
 */
export async function pickDuaImage(from: 'camera' | 'library'): Promise<PickedImage> {
  let result: ImagePicker.ImagePickerResult

  if (from === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) return { status: 'denied' }
    result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 })
  } else {
    result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 })
  }

  if (result.canceled || !result.assets[0]) return { status: 'cancelled' }
  const asset = result.assets[0]
  return { status: 'picked', uri: await shrink(asset.uri, asset.width) }
}

/** Shrinks the picture; if that fails the original is used (a big picture still works, only slower). */
async function shrink(uri: string, width: number): Promise<string> {
  try {
    const context = ImageManipulator.ImageManipulator.manipulate(uri)
    if (width > MAX_WIDTH) context.resize({ width: MAX_WIDTH })
    const image = await context.renderAsync()
    const saved = await image.saveAsync({ format: ImageManipulator.SaveFormat.JPEG, compress: 0.85 })
    return saved.uri
  } catch (error) {
    console.warn(error)
    return uri
  }
}
