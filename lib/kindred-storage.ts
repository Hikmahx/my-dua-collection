import { KINDRED_GROUPS, type KindredGroup, type Share, type UserKindred } from '@/data/types'
import type { KindredState } from '@/redux/reducers/kindredSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const KINDRED_KEY = 'kindred:v1'

const isText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

function sanitizeKindred(value: unknown): UserKindred[] | null {
  if (!Array.isArray(value)) return null
  const seen = new Set<string>()
  const rows: UserKindred[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const { userId, kindredId, groups, createdAt } = item as Record<string, unknown>
    if (!isText(userId) || !isText(kindredId) || userId === kindredId || !isText(createdAt)) continue
    const key = `${userId}:${kindredId}`
    if (seen.has(key)) continue
    seen.add(key)
    const validGroups = Array.isArray(groups)
      ? [...new Set(groups.filter((group): group is KindredGroup => KINDRED_GROUPS.includes(group as KindredGroup)))]
      : []
    rows.push({ userId, kindredId, groups: validGroups, createdAt })
  }
  return rows
}

function sanitizeShares(value: unknown): Share[] | null {
  if (!Array.isArray(value)) return null
  const shares: Share[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const share = item as Record<string, unknown>
    const validType = share.type === 'dua' || share.type === 'collection'
    const validStatus = share.status === 'pending' || share.status === 'accepted' || share.status === 'declined'
    if (!validType || !validStatus) continue
    if (!isText(share.id) || !isText(share.targetId) || !isText(share.senderId) || !isText(share.recipientId)) continue
    if (share.senderId === share.recipientId || !isText(share.createdAt)) continue
    shares.push({
      id: share.id,
      type: share.type as Share['type'],
      targetId: share.targetId,
      senderId: share.senderId,
      recipientId: share.recipientId,
      status: share.status as Share['status'],
      createdAt: share.createdAt,
      ...(isText(share.respondedAt) ? { respondedAt: share.respondedAt } : {}),
    })
  }
  return shares
}

/** Keeps only what is valid of whatever was saved; a part that is not usable is left out (and the dummy data stays). */
export function sanitizeKindredState(value: unknown): Partial<KindredState> {
  if (!value || typeof value !== 'object') return {}
  const saved = value as Record<string, unknown>
  const result: Partial<KindredState> = {}
  const kindred = sanitizeKindred(saved.kindred)
  if (kindred) result.kindred = kindred
  const shares = sanitizeShares(saved.shares)
  if (shares) result.shares = shares
  return result
}

/** The saved kindred and shares, or null if nothing was saved yet (=> the dummy data in data/). */
export async function loadKindred(): Promise<Partial<KindredState> | null> {
  try {
    const raw = await AsyncStorage.getItem(KINDRED_KEY)
    return raw ? sanitizeKindredState(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export async function saveKindred(state: KindredState) {
  try {
    await AsyncStorage.setItem(KINDRED_KEY, JSON.stringify(state))
  } catch {
    // not critical: the change still applies for this session
  }
}
