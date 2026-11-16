export type AvatarGender = 'male' | 'female'

/** What the user can change about their avatar. Colors are '#RRGGBB'. */
export interface AvatarConfig {
  gender: AvatarGender
  skin: string
  shirt: string
  cap: string // shown on the male avatar
  hijab: string // shown on the female avatar
}

export const DEFAULT_AVATAR: AvatarConfig = {
  gender: 'male',
  skin: '#B7784A',
  shirt: '#08775E',
  cap: '#F6EEDC',
  hijab: '#08775E',
}
