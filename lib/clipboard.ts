import * as Clipboard from 'expo-clipboard'

/** Copies text to the clipboard. */
export const copyText = (text: string) => Clipboard.setStringAsync(text)
