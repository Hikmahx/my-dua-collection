import { AppearanceSettings } from '@/components/settings/sections/appearance-settings'
import { LanguageSettings } from '@/components/settings/sections/language-settings'
import { SideSheet } from '@/components/ui/side-sheet'
import { useSettingsColors } from '@/hooks/use-settings-colors'

interface DuaSidebarProps {
  visible: boolean
  onClose: () => void
}

/** The panel that slides in from the right: the same Appearance and Language sections as Settings. */
export function DuaSidebar({ visible, onClose }: DuaSidebarProps) {
  const c = useSettingsColors()

  return (
    <SideSheet visible={visible} onClose={onClose} backgroundColor={c.body}>
      <AppearanceSettings variant='flat' />
      <LanguageSettings variant='flat' />
    </SideSheet>
  )
}
