import { ProfileHeader } from '@/components/settings/profile-header'
import { AboutSettings } from '@/components/settings/sections/about-settings'
import { AppearanceSettings } from '@/components/settings/sections/appearance-settings'
import { LanguageSettings } from '@/components/settings/sections/language-settings'
import { NotificationSettings } from '@/components/settings/sections/notification-settings'
import { PersonalSettings } from '@/components/settings/sections/personal-settings'
import { ScreenHeader } from '@/components/ui/screen-header'
import { APP_NAME } from '@/constants/settings-config'
import { useProfile } from '@/hooks/use-profile'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { formatHijri, toHijri } from '@/lib/hijri'
import tw from '@/lib/tailwind'
import Constants from 'expo-constants'
import { useMemo } from 'react'
import { ScrollView, Text, View } from 'react-native'

/**
 * The Settings tab: profile, then one card per section. The sections are separate components
 * (components/settings/sections/) because some of them, like Appearance and Language, are also
 * used in the dua sidebar.
 */
export default function SettingsScreen() {
  const c = useSettingsColors()
  const profile = useProfile()
  const today = useMemo(() => `Today · ${formatHijri(toHijri())}`, [])

  return (
    <View style={{ flex: 1, backgroundColor: c.body }}>
      <ScreenHeader title='Settings' right={null} bottomPadding={0} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
        <ProfileHeader
          name={profile.fullName}
          avatar={profile.avatar}
          dateLine={today}
          connectedWith={profile.providerLabel}
        />

        <View style={tw`pt-6`}>
          <PersonalSettings />
          <NotificationSettings />
          <AppearanceSettings />
          <LanguageSettings />
          <AboutSettings />

          <Text style={[tw`font-nunito text-[11px] text-center`, { color: c.muted }]}>
            {APP_NAME} · Version {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
