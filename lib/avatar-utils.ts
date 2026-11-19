import { DEFAULT_AVATAR, type AvatarConfig } from '@/constants/avatar-config'
import { isHexColor } from '@/lib/color'

/** A valid avatar from whatever was saved: bad or missing colors fall back to the default avatar's. */
export function sanitizeAvatar(value: unknown): AvatarConfig {
  const avatar = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
  const color = (key: 'skin' | 'hair' | 'shirt' | 'cap' | 'hijab') =>
    isHexColor(avatar[key]) ? (avatar[key] as string) : DEFAULT_AVATAR[key]

  return {
    gender: avatar.gender === 'female' ? 'female' : 'male',
    skin: color('skin'),
    hair: color('hair'),
    shirt: color('shirt'),
    cap: color('cap'),
    hijab: color('hijab'),
  }
}

export const avatarsEqual = (a: AvatarConfig, b: AvatarConfig) =>
  a.gender === b.gender &&
  a.skin === b.skin &&
  a.hair === b.hair &&
  a.shirt === b.shirt &&
  a.cap === b.cap &&
  a.hijab === b.hijab
