import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow, type SettingsIconName } from '@/components/settings/settings-row'
import { SUPPORT_EMAIL } from '@/constants/settings-config'
import { Linking } from 'react-native'

// Only Contact support does something yet; the others get their screens later (add an onPress then).
const ABOUT_ROWS: { icon: SettingsIconName; title: string; onPress?: () => void }[] = [
  { icon: 'information-outline', title: 'App information' },
  { icon: 'book-open-page-variant-outline', title: 'Help documentation' },
  {
    icon: 'email-outline',
    title: 'Contact support',
    onPress: () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`),
  },
  { icon: 'shield-check-outline', title: 'Privacy policy' },
]

export function AboutSettings({ variant }: { variant?: SettingsVariant }) {
  return (
    <SettingsGroup title='About & support' variant={variant}>
      {ABOUT_ROWS.map((row) => (
        <SettingsRow key={row.title} {...row} />
      ))}
    </SettingsGroup>
  )
}
