import type { KindredGroup, ShareTarget, User } from '@/data'
import { useKindred } from '@/hooks/use-kindred'
import { useKindredActions } from '@/hooks/use-kindred-actions'
import { parseUserCodeInput } from '@/lib/user-code'
import {
  countPicks,
  NO_PICKS,
  resolveRecipients,
  searchKindred,
  shortName,
  toggleGroupPick,
  togglePersonPick,
  type CodeLookup,
  type Picks,
} from '@/lib/kindred'
import { useCallback, useState } from 'react'

/** What the middle of the share sheet shows: kindred, the groups, or the "Add by code" steps. */
export type PickerMode = 'people' | 'groups' | 'code'

/**
 * The steps of "Add by code":
 * - `enter`: typing the code (`problem` is what went wrong with the last try),
 * - `found`: someone has that code, and the sender confirms it is who they meant,
 * - `save`: "Save as kindred?" (only asked when the person is not kindred yet).
 */
export type CodeStep =
  | { name: 'enter'; loading: boolean; problem?: Exclude<CodeLookup['status'], 'found'> }
  | { name: 'found'; user: User }
  | { name: 'save'; user: User; groups: KindredGroup[] }

const ENTER: CodeStep = { name: 'enter', loading: false }

export interface SentSummary {
  /** The people a share was made for, e.g. 'Maryam A.' */
  names: string[]
  /** People who already had this item waiting, so they were not sent a second one. */
  alreadyPending: string[]
}

/**
 * The state of the share sheet's kindred picker: who is picked, the search text, the groups view, and
 * the "Add by code" flow. People found by code who are not saved as kindred ("No, just this once")
 * stay in `oneOff` for this sheet only, so they can be picked and unpicked like everyone else.
 */
export function useSharePicker(target: { type: ShareTarget; id: string }) {
  const { entries, senderId, isKindred } = useKindred()
  const actions = useKindredActions()
  const [mode, setModeState] = useState<PickerMode>('people')
  const [query, setQuery] = useState('')
  const [picks, setPicks] = useState<Picks>(NO_PICKS)
  const [oneOff, setOneOff] = useState<User[]>([])
  const [codeStep, setCodeStep] = useState<CodeStep>(ENTER)

  const setMode = useCallback((next: PickerMode) => {
    setModeState(next)
    setQuery('')
    setCodeStep(ENTER)
  }, [])

  const pick = (id: string) =>
    setPicks((current) => (resolveRecipients(entries, current).includes(id) ? current : togglePersonPick(entries, current, id)))

  const togglePerson = (id: string) => setPicks((current) => togglePersonPick(entries, current, id))

  const leaveCodeMode = () => setMode('people')

  /** The "Find" button (or the keyboard's go key). */
  const findByCode = async () => {
    if (!parseUserCodeInput(query)) return setCodeStep({ name: 'enter', loading: false, problem: 'invalid' })
    setCodeStep({ name: 'enter', loading: true })
    const result = await actions.lookUpUserByCode(query)
    setCodeStep(result.status === 'found' ? { name: 'found', user: result.user } : { name: 'enter', loading: false, problem: result.status })
  }

  /** "Confirm" on the found person: kindred skip the question, everyone else is asked "Save as kindred?". */
  const confirmFound = () => {
    if (codeStep.name !== 'found') return
    const { user } = codeStep
    if (isKindred(user.id)) {
      pick(user.id)
      leaveCodeMode()
    } else setCodeStep({ name: 'save', user, groups: [] })
  }

  const toggleSaveGroup = (group: KindredGroup) =>
    setCodeStep((step) =>
      step.name !== 'save'
        ? step
        : { ...step, groups: step.groups.includes(group) ? step.groups.filter((item) => item !== group) : [...step.groups, group] },
    )

  /** Yes adds a kindred row; No leaves it as a one-off share. Either way the person is picked. */
  const answerSave = (save: boolean) => {
    if (codeStep.name !== 'save') return
    const { user, groups } = codeStep
    if (save) actions.addKindred(user.id, groups)
    else setOneOff((current) => (current.some((item) => item.id === user.id) ? current : [user, ...current]))
    pick(user.id)
    leaveCodeMode()
  }

  /** Back to how it was when the sheet opened. */
  const reset = useCallback(() => {
    setModeState('people')
    setQuery('')
    setCodeStep(ENTER)
    setPicks(NO_PICKS)
    setOneOff([])
  }, [])

  const recipientIds = resolveRecipients(entries, picks)
  const everyone = [...oneOff, ...entries.map((entry) => entry.user)]

  /** Sends the item to everyone who is picked, clears the picks, and says who got it. */
  const send = (): SentSummary => {
    const ids = resolveRecipients(entries, picks)
    const result = actions.sendShares(target, ids)
    const nameOf = (id: string) => {
      const user = everyone.find((candidate) => candidate.id === id)
      return user ? shortName(user) : id
    }
    setPicks(NO_PICKS)
    return { names: result.created.map((share) => nameOf(share.recipientId)), alreadyPending: result.alreadyPending.map(nameOf) }
  }

  return {
    mode,
    setMode,
    query,
    setQuery,
    entries,
    visibleEntries: searchKindred(entries, query),
    oneOff,
    /** Who gets the share: picked groups' members and people picked one by one. */
    recipientIds,
    isPicked: (id: string) => recipientIds.includes(id),
    /** The groups that are picked (a group is picked by itself, whoever is in it). */
    pickedGroups: picks.groups,
    /** What the Send button counts. */
    pickCounts: countPicks(entries, picks),
    togglePerson,
    toggleGroupPick: (group: KindredGroup) => setPicks((current) => toggleGroupPick(entries, current, group)),
    codeStep,
    findByCode,
    confirmFound,
    toggleSaveGroup,
    answerSave,
    cancelCode: leaveCodeMode,
    send,
    reset,
    senderId,
  }
}

export type SharePicker = ReturnType<typeof useSharePicker>
