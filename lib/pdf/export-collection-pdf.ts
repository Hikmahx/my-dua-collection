import type { ArabicFontId } from '@/constants/arabic-fonts'
import { buildCollectionPdfHtml } from '@/lib/pdf/collection-pdf-html'
import {
  PDF_PAGE,
  PDF_UNIT_ANDROID,
  PDF_UNIT_BROWSER,
  PDF_UNIT_IOS,
  pdfFileName,
  type PdfExportOptions,
} from '@/lib/pdf/pdf-config'
import { loadPdfFonts } from '@/lib/pdf/pdf-fonts'
import type { TFunction } from '@/locales'
import type { Dua } from '@/redux/reducers/duasSlice'
import * as FileSystem from 'expo-file-system/legacy'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { Platform } from 'react-native'

/** Why an export could not be done, so the screen can say something fitting. */
export type PdfExportErrorCode = 'sharing-unavailable' | 'failed'

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

  // in a browser there is no file to make: use printCollectionPdfInBrowser
  if (Platform.OS === 'web') throw new PdfExportError('failed')

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

/**
 * Prints an HTML document from a hidden frame, so the browser's print dialog (Save as PDF, or a printer) shows the
 * PDF pages and not the app. The page title is the suggested file name.
 */
function printHtmlInBrowser(html: string, fileName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe')
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden'
    const previousTitle = document.title
    let finished = false

    const finish = (error?: unknown) => {
      if (finished) return
      finished = true
      document.title = previousTitle
      frame.remove()
      if (error) reject(error)
      else resolve()
    }

    frame.onload = async () => {
      try {
        const win = frame.contentWindow
        if (!win) throw new Error('No print frame')
        // the fonts are in the document as data, but need a moment to be ready
        await win.document.fonts?.ready
        win.addEventListener('afterprint', () => finish())
        document.title = fileName
        win.focus()
        win.print() // blocks until the dialog is closed
        // some browsers do not report afterprint: do not keep the frame forever
        setTimeout(() => finish(), 2000)
      } catch (error) {
        finish(error)
      }
    }
    frame.srcdoc = html
    document.body.appendChild(frame)
  })
}

/** Web: opens the browser's print dialog with the PDF pages, where "Save as PDF" saves the file. */
export async function printCollectionPdfInBrowser(params: CreateCollectionPdfParams): Promise<void> {
  const { collectionName, duas, options, translationLanguage, arabicFont, t } = params
  try {
    const fonts = await loadPdfFonts(arabicFont)
    const html = buildCollectionPdfHtml({
      collectionName,
      duas,
      options,
      translationLanguage,
      fonts,
      unit: PDF_UNIT_BROWSER,
      cssPageSize: true,
      t,
    })
    await printHtmlInBrowser(html, pdfFileName(collectionName))
  } catch (error) {
    throw new PdfExportError('failed', error)
  }
}
