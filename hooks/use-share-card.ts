import {
  DEFAULT_CARD_OPTIONS,
  DEFAULT_CARD_THEME,
  type CardOptions,
  type CardThemeId,
} from '@/constants/share-config'
import { CARD_THEMES } from '@/constants/share-theme'
import { useT } from '@/hooks/use-t'
import { useToast } from '@/hooks/use-toast'
import { copyText } from '@/lib/clipboard'
import { formatSourceLine } from '@/lib/dua-utils'
import { getCardContent } from '@/lib/share/card-layout'
import {
  captureCard,
  savePictureToPhotos,
  sharePictureWithSystemSheet,
  type CardSize,
} from '@/lib/share/capture-card'
import { shareImageToApp } from '@/lib/share/social-share'
import type { SocialTarget } from '@/lib/share/social-targets'
import { buildShareCaption, buildShareText } from '@/lib/share/share-text'
import type { Dua } from '@/redux/reducers/duasSlice'
import type { RootState } from '@/redux/store'
import { useMemo, useRef, useState } from 'react'
import type { View } from 'react-native'
import { useSelector } from 'react-redux'

/** What an action reports: shown as a toast. */
interface ShareResult {
  kind: 'success' | 'error'
  message: string
}

/**
 * The card of a dua and everything that can be done with it: its look (theme and what is shown),
 * and the actions of the share sheet: save the picture, copy the text, send the picture to an app
 * or to the system share sheet. `busy` is the action that is running (the picture takes a moment). What
 * happened (saved, copied, a problem) is shown as a toast.
 */
export function useShareCard(dua: Dua) {
  const t = useT()
  const toast = useToast()
  const language = useSelector((state: RootState) => state.settings.translationLanguage)
  const [themeId, setThemeId] = useState<CardThemeId>(DEFAULT_CARD_THEME)
  const [options, setOptions] = useState<CardOptions>(DEFAULT_CARD_OPTIONS)
  const [busy, setBusy] = useState<string | null>(null)
  const cardRef = useRef<View | null>(null)
  const sizeRef = useRef<CardSize>({ width: 0, height: 0 })

  const content = useMemo(
    () => getCardContent(dua, language, options, formatSourceLine(dua)),
    [dua, language, options],
  )

  /** Runs one action: shows it as busy, and turns a failure into a message. */
  const run = async (id: string, action: () => Promise<ShareResult | null>) => {
    if (busy) return
    setBusy(id)
    try {
      const result = await action()
      if (result) toast[result.kind](result.message)
    } catch {
      toast.error(t('share.status.error'))
    } finally {
      setBusy(null)
    }
  }

  const takePicture = () => captureCard(cardRef, sizeRef.current)

  return {
    theme: CARD_THEMES[themeId],
    themeId,
    setThemeId,
    options,
    toggleOption: (key: keyof CardOptions) => setOptions((current) => ({ ...current, [key]: !current[key] })),
    content,
    cardRef,
    /** The card reports its size once it is on screen (the picture needs it). */
    onCardSize: (size: CardSize) => {
      sizeRef.current = size
    },
    busy,

    saveImage: () =>
      run('save', async () => {
        const result = await savePictureToPhotos(await takePicture())
        return result === 'saved'
          ? { kind: 'success', message: t('share.status.saved') }
          : { kind: 'error', message: t('share.status.denied') }
      }),

    copyText: () =>
      run('copy', async () => {
        await copyText(buildShareText(dua, language, options))
        return { kind: 'success', message: t('share.status.copied') }
      }),

    /** The picture to one app (WhatsApp, Instagram, ...). */
    shareToApp: (target: SocialTarget) =>
      run(target.id, async () => {
        const result = await shareImageToApp(target, await takePicture(), buildShareCaption(dua), t('share.dialogTitle'))
        return result === 'unavailable' ? { kind: 'error', message: t('share.status.unavailable') } : null
      }),

    /** The picture to the system share sheet, where the person picks any app. */
    shareWithSystemSheet: () =>
      run('more', async () => {
        const opened = await sharePictureWithSystemSheet(await takePicture(), t('share.dialogTitle'))
        return opened ? null : { kind: 'error', message: t('share.status.unavailable') }
      }),
  }
}

export type ShareCardController = ReturnType<typeof useShareCard>
