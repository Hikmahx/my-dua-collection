import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'

export function PersonalSettings({ variant }: { variant?: SettingsVariant }) {
  return (
    <SettingsGroup title='Personal' variant={variant}>
      <SettingsRow
        icon='account-outline'
        title='Profile details'
        subtitle='Name, avatar & connected account'
      />
    </SettingsGroup>
  )
}
