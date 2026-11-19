import { SignInOptions } from '@/components/profile/sign-in-options'
import { SettingsGroup, type SettingsVariant } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'
import { DialogModal } from '@/components/ui/dialog-modal'
import { getAuthProvider } from '@/constants/auth-config'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useProfile } from '@/hooks/use-profile'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useUserActions } from '@/hooks/use-user-actions'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Text } from 'react-native'

/**
 * Personal: Profile details (opens the profile screen), and then either the connected account
 * (signed in) or a Sign in row (not signed in).
 */
export function PersonalSettings({ variant }: { variant?: SettingsVariant }) {
  const c = useSettingsColors()
  const isDark = useColorScheme() === 'dark'
  const router = useRouter()
  const profile = useProfile()
  const { signIn } = useUserActions()
  const [signInOpen, setSignInOpen] = useState(false)
  const provider = profile.provider ? getAuthProvider(profile.provider) : null

  return (
    <>
      <SettingsGroup title='Personal' variant={variant}>
        <SettingsRow
          icon='account-outline'
          title='Profile details'
          subtitle={profile.isSignedIn ? 'Name, avatar & connected account' : 'Name and avatar'}
          onPress={() => router.push('/profile')}
        />
        {provider ? (
          <SettingsRow
            icon={provider.icon}
            title={`Connected with ${provider.label}`}
            subtitle={profile.email ?? `No email shared by ${provider.label}`}
            chevron={false}
            control={<MaterialCommunityIcons name='check-circle' size={22} color={c.accent} />}
          />
        ) : (
          <SettingsRow
            icon='login'
            title='Sign in'
            subtitle='Save your collections and share duas with friends'
            onPress={() => setSignInOpen(true)}
          />
        )}
      </SettingsGroup>

      <DialogModal visible={signInOpen} title='Sign in' onClose={() => setSignInOpen(false)}>
        <Text
          style={tw`font-nunito text-[13px] leading-[19px] mb-4 ${isDark ? 'text-white' : 'text-dark-text'}`}
        >
          Sign in to save your collections online and share duas with friends.
        </Text>
        <SignInOptions onSignIn={signIn} onSignedIn={() => setSignInOpen(false)} />
      </DialogModal>
    </>
  )
}
