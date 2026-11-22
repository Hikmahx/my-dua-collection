import { DuplicateDuaModal } from '@/components/add-dua/duplicate-dua-modal'
import { AFTER_MODAL_CLOSE_MS } from '@/constants/ui'
import { findSimilarDua } from '@/lib/dua-duplicates'
import type { Dua } from '@/redux/reducers/duasSlice'
import type { RootState } from '@/redux/store'
import { useCallback, useState, type ReactElement } from 'react'
import { useSelector } from 'react-redux'

interface PendingSave {
  existing: Dua
  proceed: () => void
}

/**
 * The duplicate check for every way of adding a dua (manual, image, AI). Call `checkBeforeSave`
 * with the Arabic text and the function that saves, right before saving: for manual that is the
 * typed text, for image and AI it is the text once it has been extracted or generated. If no
 * pre-made or user dua has the same (or nearly the same) Arabic, `save` runs straight away.
 * Otherwise `modal` asks the user: select the existing dua (`onUseExisting`), or add it anyway
 * (`save` runs). Render `modal` once in the form.
 */
export function useDuplicateDuaGuard(onUseExisting: (dua: Dua) => void): {
  checkBeforeSave: (arabicText: string, save: () => void) => void
  modal: ReactElement
} {
  const duas = useSelector((state: RootState) => state.duas.items)
  const [pending, setPending] = useState<PendingSave | null>(null)

  const checkBeforeSave = useCallback(
    (arabicText: string, save: () => void) => {
      const existing = findSimilarDua(arabicText, duas)
      if (existing) setPending({ existing, proceed: save })
      else save()
    },
    [duas],
  )

  const close = () => setPending(null)

  const modal = (
    <DuplicateDuaModal
      dua={pending?.existing}
      onSelectExisting={() => {
        if (pending) onUseExisting(pending.existing)
        close()
      }}
      onAddAnyway={() => {
        const save = pending?.proceed
        close()
        // The save ends with an Alert, which cannot show while this modal is still closing
        if (save) setTimeout(save, AFTER_MODAL_CLOSE_MS)
      }}
      onDismiss={close}
    />
  )

  return { checkBeforeSave, modal }
}
