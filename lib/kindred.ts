import type { KindredGroup, Share, ShareTarget, User, UserKindred } from '@/data/types'
import { KINDRED_GROUPS } from '@/data/types'
import { fullName } from '@/lib/profile-utils'
import { matchesSearch } from '@/lib/search'
import { parseUserCodeInput } from '@/lib/user-code'

/** One person in the share sheet's grid: who they are, and the groups the sender put them in. */
export interface KindredEntry {
  user: User
  groups: KindredGroup[]
  createdAt: string
}

/** The sender's kindred as people, A to Z by name. A row whose user is not known is skipped. */
export function getKindredEntries(rows: UserKindred[], users: User[], userId: string): KindredEntry[] {
  const byId = new Map(users.map((user) => [user.id, user]))
  return rows
    .filter((row) => row.userId === userId && row.kindredId !== userId)
    .flatMap((row) => {
      const user = byId.get(row.kindredId)
      return user ? [{ user, groups: row.groups, createdAt: row.createdAt }] : []
    })
    .sort((a, b) => userName(a.user).localeCompare(userName(b.user)))
}

export const userName = (user: Pick<User, 'firstName' | 'lastName'>) => fullName(user.firstName, user.lastName)

/** What the app shows for a person found by code: first name and the last initial, e.g. 'Maryam A.' */
export function shortName(user: Pick<User, 'firstName' | 'lastName'>): string {
  const initial = user.lastName?.trim().charAt(0).toUpperCase()
  return initial ? `${user.firstName} ${initial}.` : user.firstName
}

export const isKindred = (rows: UserKindred[], userId: string, otherId: string) =>
  rows.some((row) => row.userId === userId && row.kindredId === otherId)

/** The entries whose name or email contains the text. Empty text keeps everyone. */
export const searchKindred = (entries: KindredEntry[], query: string) =>
  entries.filter((entry) => matchesSearch(query, [userName(entry.user), entry.user.email]))

/** How many of the entries are in each group (a person in two groups counts in both). */
export function countByGroup(entries: KindredEntry[]): Record<KindredGroup, number> {
  const counts = Object.fromEntries(KINDRED_GROUPS.map((group) => [group, 0])) as Record<KindredGroup, number>
  for (const entry of entries) for (const group of entry.groups) counts[group] += 1
  return counts
}

export const idsInGroup = (entries: KindredEntry[], group: KindredGroup) =>
  entries.filter((entry) => entry.groups.includes(group)).map((entry) => entry.user.id)

/**
 * What is picked in the share sheet: whole groups, single people, and people taken out of a picked
 * group again. A group is picked or not by itself, so picking Friends never marks Classmates, even
 * when someone is in both.
 */
export interface Picks {
  groups: ReadonlySet<KindredGroup>
  /** People picked one by one. */
  people: ReadonlySet<string>
  /** People who were let go while their group stays picked. */
  excluded: ReadonlySet<string>
}

export const NO_PICKS: Picks = { groups: new Set(), people: new Set(), excluded: new Set() }

/** Everyone who gets the share: the members of the picked groups plus the people picked one by one, minus those let go. */
export function resolveRecipients(entries: KindredEntry[], picks: Picks): string[] {
  const ids = new Set(picks.people)
  for (const group of picks.groups) for (const id of idsInGroup(entries, group)) ids.add(id)
  for (const id of picks.excluded) ids.delete(id)
  return [...ids]
}

/** What the Send button counts: the picked groups, and the people picked on their own (not already in a picked group). */
export function countPicks(entries: KindredEntry[], picks: Picks): { groups: number; people: number } {
  const covered = new Set([...picks.groups].flatMap((group) => idsInGroup(entries, group)))
  return { groups: picks.groups.size, people: [...picks.people].filter((id) => !covered.has(id)).length }
}

/** Picks or lets go of a group. Letting go also clears the exclusions that only made sense with that group. */
export function toggleGroupPick(entries: KindredEntry[], picks: Picks, group: KindredGroup): Picks {
  const groups = new Set(picks.groups)
  if (groups.has(group)) groups.delete(group)
  else groups.add(group)
  const excluded = new Set(picks.excluded)
  for (const id of idsInGroup(entries, group)) excluded.delete(id)
  return { ...picks, groups, excluded }
}

/** Taps one person: picks them, or lets them go (also when they were only in because of a picked group). */
export function togglePersonPick(entries: KindredEntry[], picks: Picks, id: string): Picks {
  const selected = resolveRecipients(entries, picks).includes(id)
  const people = new Set(picks.people)
  const excluded = new Set(picks.excluded)
  if (selected) {
    people.delete(id)
    if ([...picks.groups].some((group) => idsInGroup(entries, group).includes(id))) excluded.add(id)
  } else {
    excluded.delete(id)
    people.add(id)
  }
  return { ...picks, people, excluded }
}

/** What happened to a typed user code. 'invalid' and 'self' are decided without a request. */
export type CodeLookup =
  | { status: 'found'; user: User }
  | { status: 'invalid' }
  | { status: 'self' }
  | { status: 'notFound' }
  | { status: 'rateLimited' }

/**
 * Finds the user a typed code belongs to. Case, spaces and hyphens do not matter ('bg 7k3m' finds
 * BG7K3M). Text that cannot be a code, and the user's own code, are answered without looking anything up.
 */
export function findUserByCode(users: User[], input: string, selfId: string): CodeLookup {
  const code = parseUserCodeInput(input)
  if (!code) return { status: 'invalid' }
  const user = users.find((candidate) => candidate.userCode === code)
  if (user?.id === selfId) return { status: 'self' }
  return user ? { status: 'found', user } : { status: 'notFound' }
}

/** The backend allows about 10 code lookups a minute per user; this is the same rule for the dummy data. */
export const CODE_LOOKUPS_PER_MINUTE = 10

/** Returns a function that says whether one more lookup is allowed right now (and counts it). */
export function createLookupLimiter(max = CODE_LOOKUPS_PER_MINUTE, windowMs = 60_000, now: () => number = Date.now) {
  let times: number[] = []
  return () => {
    const current = now()
    times = times.filter((time) => current - time < windowMs)
    if (times.length >= max) return false
    times.push(current)
    return true
  }
}

/** A new id for a share. The backend makes the real one. */
export const createShareId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16)
    return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })

export interface SentShares {
  /** One pending share per person. */
  created: Share[]
  /** People who already have this same item waiting from this sender, so it is not sent twice. */
  alreadyPending: string[]
}

/**
 * One pending Share per recipient (never the sender, never the same person twice). A person who
 * already has a pending share of the same item from the sender is left out and reported instead.
 */
export function buildShares(
  target: { type: ShareTarget; id: string },
  senderId: string,
  recipientIds: readonly string[],
  existing: readonly Share[],
  now: string,
  createId: () => string = createShareId,
): SentShares {
  const created: Share[] = []
  const alreadyPending: string[] = []
  for (const recipientId of new Set(recipientIds)) {
    if (recipientId === senderId) continue
    const waiting = existing.some(
      (share) =>
        share.status === 'pending' &&
        share.senderId === senderId &&
        share.recipientId === recipientId &&
        share.type === target.type &&
        share.targetId === target.id,
    )
    if (waiting) alreadyPending.push(recipientId)
    else
      created.push({
        id: createId(),
        type: target.type,
        targetId: target.id,
        senderId,
        recipientId,
        status: 'pending',
        createdAt: now,
      })
  }
  return { created, alreadyPending }
}
