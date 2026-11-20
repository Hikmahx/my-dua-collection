import { MAX_COLLECTION_NAME_LENGTH } from '@/constants/collections'
import { useCollections } from '@/hooks/use-collections'
import { useT } from '@/hooks/use-t'
import { isCollectionNameTaken } from '@/lib/collection-utils'
import { useCallback, useState } from 'react'

/**
 * The "new collection name" field shared by the add-dua form ("+" pill) and the "Save to
 * collection" sheet ("New collection"): whether it is open, the typed name, and its checks (not empty, not
 * the name of one of the user's collections, case ignored). `onCreate` gets the valid, trimmed
 * name. `pendingNames` are names that are taken too, though they do not exist yet. `check` runs the
 * same checks without creating anything (for a form that is saved while the field is still open).
 */
export function useNewCollectionInput(onCreate: (name: string) => void, pendingNames: string[] = []) {
  const t = useT()
  const { userCollections } = useCollections()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const open = useCallback(() => setCreating(true), [])

  const close = useCallback(() => {
    setCreating(false)
    setName('')
    setError(null)
  }, [])

  const changeName = useCallback((text: string) => {
    setName(text)
    setError(null)
  }, [])

  /** The typed name, trimmed, when it is valid. Otherwise shows what is wrong under the field and returns null. */
  const check = useCallback((): string | null => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError(t('newCollection.enterName'))
      return null
    }
    if (isCollectionNameTaken(trimmed, userCollections, pendingNames)) {
      setError(t('newCollection.nameTaken'))
      return null
    }
    return trimmed
  }, [name, userCollections, pendingNames, t])

  const submit = useCallback(() => {
    const valid = check()
    if (!valid) return
    onCreate(valid)
    close()
  }, [check, onCreate, close])

  return { creating, name, error, open, close, changeName, submit, check, maxLength: MAX_COLLECTION_NAME_LENGTH }
}
