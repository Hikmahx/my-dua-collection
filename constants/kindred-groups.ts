import type { KindredGroup } from '@/data/types'
import type { TranslationKey } from '@/locales'
import type { Feather } from '@expo/vector-icons'
import type { ComponentProps } from 'react'

/** How each kindred group looks in the app: its name (translated) and its icon. The groups themselves are KINDRED_GROUPS in data/types.ts. */
export const KINDRED_GROUP_INFO: Record<KindredGroup, { labelKey: TranslationKey; icon: ComponentProps<typeof Feather>['name'] }> = {
  family: { labelKey: 'group.family', icon: 'home' },
  friends: { labelKey: 'group.friends', icon: 'smile' },
  mosque: { labelKey: 'group.mosque', icon: 'moon' },
  classmates: { labelKey: 'group.classmates', icon: 'book-open' },
}
