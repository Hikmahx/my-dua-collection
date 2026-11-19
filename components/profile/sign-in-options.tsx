import { AUTH_PROVIDERS } from '@/constants/auth-config'
import type { AuthProvider } from '@/data/types'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

interface SignInOptionsProps {
  /** Resolves when the user is signed in. */
  onSignIn: (provider: AuthProvider) => Promise<void>
  /** Called once the user is signed in (e.g. to close a dialog). */
  onSignedIn?: () => void
}

/** "Continue with Google" and "Continue with Facebook", with a short reason to sign in. */
export function SignInOptions({ onSignIn, onSignedIn }: SignInOptionsProps) {
  const c = useSettingsColors()
  const [busy, setBusy] = useState<AuthProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const signIn = async (provider: AuthProvider) => {
    setBusy(provider)
    setError(null)
    try {
      await onSignIn(provider)
      onSignedIn?.()
    } catch {
      setError('Could not sign in. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <View>
      {AUTH_PROVIDERS.map(({ id, label, icon }) => (
        <Pressable
          key={id}
          onPress={() => signIn(id)}
          disabled={busy !== null}
          accessibilityRole='button'
          accessibilityLabel={`Continue with ${label}`}
          style={({ pressed }) => [
            tw`flex-row items-center justify-center h-[48px] rounded-xl mb-3`,
            {
              backgroundColor: c.field,
              borderWidth: 1,
              borderColor: c.fieldBorder,
              opacity: busy !== null && busy !== id ? 0.5 : pressed ? 0.8 : 1,
            },
          ]}
        >
          {busy === id ? (
            <ActivityIndicator color={c.accent} />
          ) : (
            <MaterialCommunityIcons name={icon} size={20} color={c.accent} style={tw`mr-[10px]`} />
          )}
          <Text style={[tw`font-nunito-semibold text-[14px]`, { color: c.title }]}>Continue with {label}</Text>
        </Pressable>
      ))}
      {!!error && <Text style={[tw`font-nunito text-[12px] text-center mb-2`, { color: c.danger }]}>{error}</Text>}
    </View>
  )
}
