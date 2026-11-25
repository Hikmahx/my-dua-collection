import { sharePictureWithSystemSheet } from '@/lib/share/capture-card'
import type { SocialTarget } from '@/lib/share/social-targets'

export type SocialShareResult = 'shared' | 'cancelled' | 'fallback' | 'unavailable'

interface ShareLibrary {
  shareSingle: (options: Record<string, unknown>) => Promise<{ success: boolean; message?: string }>
}

/**
 * react-native-share is loaded only when needed. It is a native module, so it is missing in Expo
 * Go, and importing it there would stop the whole app at launch.
 */
function loadShareLibrary(): { lib: ShareLibrary; social: Record<string, string> } | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-share')
    return { lib: mod.default as ShareLibrary, social: mod.Social as Record<string, string> }
  } catch {
    return null
  }
}

/**
 * Sends the card picture straight to one app (the app opens with the picture ready). When that is
 * not possible (Expo Go, or the app is not installed) it opens the system share sheet instead, where
 * the person can pick any app. 'cancelled' when they closed the app's share screen.
 */
export async function shareImageToApp(
  target: SocialTarget,
  uri: string,
  message: string,
  dialogTitle: string,
): Promise<SocialShareResult> {
  const loaded = loadShareLibrary()
  if (loaded) {
    try {
      const result = await loaded.lib.shareSingle({
        social: loaded.social[target.social] ?? target.social,
        url: uri,
        type: 'image/png',
        message,
        failOnCancel: false,
      })
      return result.success ? 'shared' : 'cancelled'
    } catch {
      // not installed, or no native module: fall through to the system share sheet
    }
  }
  return (await sharePictureWithSystemSheet(uri, dialogTitle)) ? 'fallback' : 'unavailable'
}
