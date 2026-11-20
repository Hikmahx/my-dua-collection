import { useT } from '@/hooks/use-t'
import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow, type SettingsIconName } from '@/components/settings/settings-row'
import { SUPPORT_EMAIL } from '@/constants/settings-config'
import { Linking } from 'react-native'

export function AboutSettings({ variant }: { variant?: SettingsVariant }) {
  const t = useT()

  // Only Contact support does something yet; the others get their screens later (add an onPress then).
  const rows: { icon: SettingsIconName; title: string; onPress?: () => void }[] = [
    { icon: 'information-outline', title: t('about.appInfo') },
    { icon: 'book-open-page-variant-outline', title: t('about.help') },
    {
      icon: 'email-outline',
      title: t('about.contact'),
      onPress: () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`),
    },
    { icon: 'shield-check-outline', title: t('about.privacy') },
  ]

  return (
    <SettingsGroup title={t('about.title')} variant={variant}>
      {rows.map((row) => (
        <SettingsRow key={row.icon} {...row} />
      ))}
    </SettingsGroup>
  )
}
