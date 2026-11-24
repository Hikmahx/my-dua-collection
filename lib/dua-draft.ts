import { isValidReference } from '@/lib/dua-utils'
import type { DuaSource } from '@/redux/reducers/duasSlice'
import { Platform } from 'react-native'

/** How a draft came to be: read from a picture, or written by the AI. It becomes the dua's `origin`. */
export type DraftOrigin = 'image' | 'ai'

/**
 * What the image scan and the AI hand to the "Add dua" form. The form is filled in with it (like an autofill) and
 * the user checks and edits it before saving, so both ways end up in the same manual form.
 */
export interface DuaDraft {
  title: string
  arabicText: string
  transliteration?: string
  /** In the language chosen in Settings. */
  translation: string
  source?: DuaSource
  reference?: string
  /** Background or context; saved as the dua's notes. */
  notes?: string
}

export type DraftErrorCode = 'no-text' | 'failed'

export class DraftError extends Error {
  constructor(
    public readonly code: DraftErrorCode,
    cause?: unknown,
  ) {
    super(`Dua draft failed: ${code}${cause instanceof Error ? ` (${cause.message})` : ''}`)
    this.name = 'DraftError'
  }
}

/**
 * Address of the backend (which holds the OCR and AI keys, never the app), e.g. https://api.example.com. Set it as
 * EXPO_PUBLIC_API_URL in `.env`. Without it the placeholders below answer, so the screens can be tried.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '')

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

/**
 * Turns what the backend sent into a draft, and throws `no-text` when there is no Arabic in it. Nothing from the
 * backend is trusted: a source that is not Quran or Hadith, or a reference in the wrong format, is dropped (the
 * user can still pick them in the form).
 */
export function parseDraft(raw: unknown, language: string): DuaDraft {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>

  const arabicText = text(data.arabicText)
  if (!arabicText) throw new DraftError('no-text')

  const translations = (data.translations && typeof data.translations === 'object' ? data.translations : {}) as Record<
    string,
    unknown
  >
  const source: DuaSource | undefined = data.source === 'quran' || data.source === 'hadith' ? data.source : undefined
  const reference = text(data.reference)

  return {
    title: text(data.title),
    arabicText,
    ...(text(data.transliteration) && { transliteration: text(data.transliteration) }),
    translation: text(data.translation) || text(translations[language]) || text(translations.en),
    ...(source && { source }),
    ...(source && reference && isValidReference(source, reference) && { reference }),
    ...(text(data.notes) && { notes: text(data.notes) }),
  }
}

async function postToBackend(path: string, body: FormData | string, isJson: boolean): Promise<unknown> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    ...(isJson && { headers: { 'Content-Type': 'application/json' } }),
    body,
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

/**
 * Reads the dua in a picture (OCR on the backend: Google Vision, with Arabic as the language hint) and returns it
 * as a draft. The picture is already shrunk (see lib/pick-dua-image.ts).
 *
 * Backend contract: POST {API_URL}/api/duas/scan, multipart with `image` and `language`. Answers
 * `{ arabicText, title?, transliteration?, translation?, source?, reference?, notes? }`.
 * PLACEHOLDER without EXPO_PUBLIC_API_URL: waits a moment and returns a sample dua.
 */
export async function scanDuaImage(imageUri: string, language: string): Promise<DuaDraft> {
  if (!API_URL) {
    await wait(1600)
    return {
      title: 'Dua for knowledge',
      arabicText: 'رَبِّ زِدْنِي عِلْمًا',
      transliteration: "Rabbi zidni 'ilma",
      translation: 'My Lord, increase me in knowledge.',
      source: 'quran',
      reference: '20:114',
    }
  }

  try {
    const form = new FormData()
    if (Platform.OS === 'web') {
      form.append('image', await (await fetch(imageUri)).blob(), 'dua.jpg')
    } else {
      form.append('image', { uri: imageUri, name: 'dua.jpg', type: 'image/jpeg' } as unknown as Blob)
    }
    form.append('language', language)
    return parseDraft(await postToBackend('/api/duas/scan', form, false), language)
  } catch (error) {
    throw error instanceof DraftError ? error : new DraftError('failed', error)
  }
}

/**
 * Asks the AI for a dua that fits what the user describes and returns it as a draft.
 *
 * Backend contract: POST {API_URL}/api/duas/generate with `{ prompt, language }`. Answers the same shape as the scan.
 * PLACEHOLDER without EXPO_PUBLIC_API_URL: waits a moment and returns a sample dua.
 */
export async function generateDua(prompt: string, language: string): Promise<DuaDraft> {
  if (!API_URL) {
    await wait(1600)
    return {
      title: 'Good in this world and the next',
      arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
      translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
      source: 'quran',
      reference: '2:201',
    }
  }

  try {
    const json = await postToBackend('/api/duas/generate', JSON.stringify({ prompt, language }), true)
    return parseDraft(json, language)
  } catch (error) {
    throw error instanceof DraftError ? error : new DraftError('failed', error)
  }
}
