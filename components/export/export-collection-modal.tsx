import { DialogButtons } from '@/components/ui/dialog-buttons'
import { DialogModal } from '@/components/ui/dialog-modal'
import { ToggleSwitch } from '@/components/settings/toggle-switch'
import { languageName } from '@/constants/settings-config'
import { useArabicFont } from '@/hooks/use-arabic-font'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useT } from '@/hooks/use-t'
import {
  createCollectionPdf,
  PdfExportError,
  printCollectionPdfInBrowser,
  savePdfToDevice,
  shareCollectionPdf,
} from '@/lib/pdf/export-collection-pdf'
import { DEFAULT_PDF_OPTIONS, pdfFileName, type PdfExportOptions } from '@/lib/pdf/pdf-config'
import tw from '@/lib/tailwind'
import type { TranslationKey } from '@/locales'
import type { Dua } from '@/redux/reducers/duasSlice'
import type { RootState } from '@/redux/store'
import { useState } from 'react'
import { Alert, Platform, Pressable, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

interface ExportCollectionModalProps {
  visible: boolean
  collectionName: string
  /** The duas to put in the PDF, in the order of the collection. */
  duas: Dua[]
  onClose: () => void
}

interface OptionRow {
  key: keyof PdfExportOptions
  label: TranslationKey
  hint: TranslationKey
}

/** The switches of the dialog, in the order they are shown. */
const OPTION_ROWS: readonly OptionRow[] = [
  { key: 'coverPage', label: 'export.coverPage', hint: 'export.coverPageHint' },
  { key: 'translation', label: 'export.translation', hint: 'export.translationHint' },
  { key: 'transliteration', label: 'export.transliteration', hint: 'export.transliterationHint' },
  { key: 'source', label: 'export.source', hint: 'export.sourceHint' },
  { key: 'onePerPage', label: 'export.onePerPage', hint: 'export.onePerPageHint' },
  { key: 'repeat', label: 'export.repeat', hint: 'export.repeatHint' },
  { key: 'notes', label: 'export.notes', hint: 'export.notesHint' },
]

/** Lets the share sheet open after this dialog has finished closing (two native modals cannot overlap on iOS). */
const CLOSE_ANIMATION_MS = 350
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * "Export as PDF": the dialog behind the Export option of a collection's menu. The user picks what goes into the
 * PDF, taps Export PDF, and then shares or saves the finished file. The PDF is made on the device, so there is
 * no backend involved (see lib/pdf/export-collection-pdf.ts).
 */
export function ExportCollectionModal({ visible, collectionName, duas, onClose }: ExportCollectionModalProps) {
  const t = useT()
  const c = useSettingsColors()
  const arabicFont = useArabicFont()
  const translationLanguage = useSelector((state: RootState) => state.settings.translationLanguage)
  const showTransliteration = useSelector((state: RootState) => state.settings.showTransliteration)

  // The dialog starts from the reader's own choices: transliteration follows the Settings switch
  const [options, setOptions] = useState<PdfExportOptions>(() => ({
    ...DEFAULT_PDF_OPTIONS,
    transliteration: showTransliteration,
  }))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setOption = (key: keyof PdfExportOptions, value: boolean) => setOptions((current) => ({ ...current, [key]: value }))

  const close = () => {
    // closing while the PDF is being made would hide the progress, so the dialog stays until it is done
    if (busy) return
    setError(null)
    onClose()
  }

  const errorMessage = (caught: unknown) => {
    const code = caught instanceof PdfExportError ? caught.code : 'failed'
    if (code === 'sharing-unavailable') return t('export.sharingUnavailableBody')
    return t('export.errorBody')
  }

  /** `share` opens the share sheet; `save` (Android) saves the file in a folder the user picks. */
  const handleExport = async (mode: 'share' | 'save' = 'share') => {
    if (busy) return
    if (duas.length === 0) {
      setError(t('export.emptyBody'))
      return
    }

    setBusy(true)
    setError(null)
    const params = { collectionName, duas, options, translationLanguage, arabicFont: arabicFont.id, t }

    // Web: the browser's print dialog does the rest ("Save as PDF")
    if (Platform.OS === 'web') {
      try {
        await printCollectionPdfInBrowser(params)
        onClose()
      } catch (caught) {
        console.warn(caught)
        setError(errorMessage(caught))
      }
      setBusy(false)
      return
    }

    let fileUri: string
    try {
      fileUri = await createCollectionPdf(params)
    } catch (caught) {
      console.warn(caught)
      setError(errorMessage(caught))
      setBusy(false)
      return
    }

    setBusy(false)

    if (mode === 'save') {
      try {
        const saved = await savePdfToDevice(fileUri, pdfFileName(collectionName))
        if (saved) {
          onClose()
          Alert.alert(t('export.savedTitle'), t('export.savedBody'))
        }
      } catch (caught) {
        console.warn(caught)
        setError(errorMessage(caught))
      }
      return
    }

    // the PDF is ready: close the dialog first, then open the share sheet over the collection
    onClose()
    await wait(CLOSE_ANIMATION_MS)
    try {
      await shareCollectionPdf(fileUri, t)
    } catch (caught) {
      console.warn(caught)
      Alert.alert(t('export.errorTitle'), errorMessage(caught))
    }
  }

  const hintParams = { language: languageName(translationLanguage) }

  return (
    <DialogModal
      visible={visible}
      title={t('export.title')}
      onClose={close}
      footer={
        <>
          {!!error && (
            <Text style={[tw`font-nunito text-[12px] mb-[12px]`, { color: c.danger }]} accessibilityRole='alert'>
              {error}
            </Text>
          )}
          {Platform.OS === 'android' && (
            <Pressable
              onPress={() => handleExport('save')}
              disabled={busy}
              accessibilityRole='button'
              style={tw`items-center py-[10px] mb-[8px] ${busy ? 'opacity-50' : ''}`}
            >
              <Text style={[tw`font-nunito-semibold text-[14px]`, { color: c.title }]}>{t('export.saveToDevice')}</Text>
            </Pressable>
          )}
          <DialogButtons
            confirmLabel={busy ? t('export.working') : t('export.action')}
            onCancel={close}
            onConfirm={() => handleExport('share')}
            confirmDisabled={busy}
          />
        </>
      }
    >
      <Text style={[tw`font-nunito text-[13px] leading-[19px]`, { color: c.muted }]}>
        {t('export.intro', { name: collectionName })}
      </Text>

      <View style={tw`mt-[6px]`}>
        {OPTION_ROWS.map((row, index) => (
          <View
            key={row.key}
            style={[
              tw`flex-row items-center py-[12px]`,
              index > 0 && { borderTopWidth: 1, borderTopColor: c.divider },
            ]}
          >
            <View style={tw`flex-1 pr-[12px]`}>
              <Text style={[tw`font-nunito-semibold text-[14px]`, { color: c.title }]}>{t(row.label)}</Text>
              <Text style={[tw`font-nunito text-[11px] mt-[2px]`, { color: c.muted }]}>{t(row.hint, hintParams)}</Text>
            </View>
            <ToggleSwitch
              value={options[row.key]}
              onValueChange={(value) => setOption(row.key, value)}
              accessibilityLabel={t(row.label)}
            />
          </View>
        ))}
      </View>

      <Text style={[tw`font-nunito text-[11px] leading-[16px] mt-[4px]`, { color: c.muted }]}>
        {t('export.arabicNote', { font: arabicFont.label })}
      </Text>
    </DialogModal>
  )
}
