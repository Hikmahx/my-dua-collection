import type { ArabicFontId } from '@/constants/arabic-fonts'
import { buildCollectionPdfHtml } from '@/lib/pdf/collection-pdf-html'
import { PDF_PAGE, PDF_UNIT_ANDROID, PDF_UNIT_IOS, pdfFileName, type PdfExportOptions } from '@/lib/pdf/pdf-config'
import { loadPdfFonts } from '@/lib/pdf/pdf-fonts'
import type { TFunction } from '@/locales'
import type { Dua } from '@/redux/reducers/duasSlice'
import * as FileSystem from 'expo-file-system/legacy'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { Platform } from 'react-native'

/** Why an export could not be done, so the screen can say something fitting. */
export type PdfExportErrorCode = 'unsupported' | 'sharing-unavailable' | 'failed'

export class PdfExportError extends Error {
  constructor(
    public readonly code: PdfExportErrorCode,
    cause?: unknown,
  ) {
    super(`PDF export failed: ${code}${cause instanceof Error ? ` (${cause.message})` : ''}`)
    this.name = 'PdfExportError'
  }
}

export interface CreateCollectionPdfParams {
  collectionName: string
  duas: Dua[]
  options: PdfExportOptions
  translationLanguage: string
  arabicFont: ArabicFontId
  t: TFunction
}

/**
 * Makes the PDF of a collection on the device (no server) and returns the file's uri. The file is named after
 * the collection.
 *
 * Steps: read the fonts, build the HTML, let the system print it to a PDF file, give the file its name.
 */
export async function createCollectionPdf(params: CreateCollectionPdfParams): Promise<string> {
  const { collectionName, duas, options, translationLanguage, arabicFont, t } = params

  // expo-print cannot write a file in the browser
  if (Platform.OS === 'web') throw new PdfExportError('unsupported')

  try {
    const fonts = await loadPdfFonts(arabicFont)
    const html = buildCollectionPdfHtml({
      collectionName,
      duas,
      options,
      translationLanguage,
      fonts,
      unit: Platform.OS === 'ios' ? PDF_UNIT_IOS : PDF_UNIT_ANDROID,
      t,
    })

    const printed = await Print.printToFileAsync({
      html,
      width: PDF_PAGE.width,
      height: PDF_PAGE.height,
      // Android only: the system font size must not change the layout the pages were planned for
      textZoom: 100,
    })

    // printToFileAsync picks a random name: the PDF is named after the collection instead
    const target = `${FileSystem.cacheDirectory}${pdfFileName(collectionName)}.pdf`
    await FileSystem.deleteAsync(target, { idempotent: true })
    await FileSystem.moveAsync({ from: printed.uri, to: target })
    return target
  } catch (error) {
    throw new PdfExportError('failed', error)
  }
}

/** Opens the share sheet for a PDF, where the user can save it to Files, send it, or print it. */
export async function shareCollectionPdf(fileUri: string, t: TFunction): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) throw new PdfExportError('sharing-unavailable')

  try {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: t('export.shareTitle'),
    })
  } catch (error) {
    throw new PdfExportError('failed', error)
  }
}
