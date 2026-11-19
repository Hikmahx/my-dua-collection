export type AvatarGender = 'male' | 'female'

/** What the user can change about their avatar. Colors are '#RRGGBB'. */
export interface AvatarConfig {
  gender: AvatarGender
  skin: string
  hair: string
  shirt: string
  cap: string // shown on the male avatar
  hijab: string // shown on the female avatar
}

export const DEFAULT_AVATAR: AvatarConfig = {
  gender: 'male',
  skin: '#B7784A',
  hair: '#00233F',
  shirt: '#08775E',
  cap: '#F6EEDC',
  hijab: '#08775E',
}

export type AvatarColorKey = 'skin' | 'hair' | 'shirt' | 'cap' | 'hijab'

/** The colors the avatar editor offers for each part. A color that is not here (e.g. one from the backend) still shows, as an extra swatch. */
export const AVATAR_PALETTES: Record<AvatarColorKey, readonly string[]> = {
  skin: ['#FDDBB4', '#F1C27D', '#E0AC69', '#C68642', '#B7784A', '#8D5524', '#6B4226', '#4A2C17'],
  hair: ['#00233F', '#2C1B0E', '#4B2E1B', '#6A4A2B', '#8B6B43', '#B08D57', '#7C7C7C', '#D8D8D8'],
  shirt: ['#08775E', '#2F4858', '#14284B', '#6B4E71', '#8B2E3F', '#C2A462', '#4A90C2', '#8F9390'],
  cap: ['#F6EEDC', '#FFFFFF', '#14284B', '#08775E', '#C2A462', '#8F9390', '#1A1A1A', '#8B2E3F'],
  hijab: ['#08775E', '#2F4858', '#14284B', '#6B4E71', '#782C95', '#8B2E3F', '#C2A462', '#F6EEDC'],
}

/** The color rows of the avatar editor, in order. `gender` limits a row to one avatar (the male has a cap and visible hair, the female a hijab). */
export const AVATAR_COLOR_FIELDS: { key: AvatarColorKey; label: string; gender?: AvatarGender }[] = [
  { key: 'skin', label: 'Skin tone' },
  { key: 'hair', label: 'Hair', gender: 'male' },
  { key: 'shirt', label: 'Shirt' },
  { key: 'cap', label: 'Cap', gender: 'male' },
  { key: 'hijab', label: 'Hijab', gender: 'female' },
]
