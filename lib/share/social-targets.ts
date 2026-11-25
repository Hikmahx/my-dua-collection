import type { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'

/**
 * The apps in the share sheet's bottom row. Each one receives the card picture, so they all work
 * the same way (see social-share.ts); the list only says which apps there are, and how they look.
 * `social` is the app's name in react-native-share.
 */
export type SocialTargetId = 'whatsapp' | 'instagram' | 'facebook' | 'x' | 'telegram' | 'messenger'

export interface SocialTarget {
  id: SocialTargetId
  /** Brand name, not translated. */
  label: string
  icon: ComponentProps<typeof Ionicons>['name']
  /** Brand color of the round icon. */
  color: string
  social: 'whatsapp' | 'instagram' | 'facebook' | 'twitter' | 'telegram' | 'messenger'
}

export const SOCIAL_TARGETS: readonly SocialTarget[] = [
  { id: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366', social: 'whatsapp' },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram', color: '#D6249F', social: 'instagram' },
  { id: 'facebook', label: 'Facebook', icon: 'logo-facebook', color: '#1877F2', social: 'facebook' },
  { id: 'x', label: 'X', icon: 'logo-twitter', color: '#111111', social: 'twitter' },
  { id: 'telegram', label: 'Telegram', icon: 'paper-plane', color: '#229ED9', social: 'telegram' },
  { id: 'messenger', label: 'Messenger', icon: 'chatbubble-ellipses', color: '#A033FF', social: 'messenger' },
]
