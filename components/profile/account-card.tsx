import { useT } from '@/hooks/use-t'
import { getAuthProvider } from '@/constants/auth-config'
import type { AuthProvider } from '@/data/types'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, View } from 'react-native'

interface AccountCardProps {
  provider: AuthProvider
  /** Missing when the provider did not share one. */
  email?: string
}

/** The account the user signed in with: its icon, "Connected with Google" and the email. */
export function AccountCard({ provider, email }: AccountCardProps) {
  const c = useSettingsColors()
  const { label, icon } = getAuthProvider(provider)
  const t = useT()

  return (
    <View style={tw`flex-row items-center py-4`}>
      <View
        style={[tw`w-[40px] h-[40px] rounded-full items-center justify-center mr-3`, { backgroundColor: c.avatarBg }]}
      >
        <MaterialCommunityIcons name={icon} size={22} color={c.accent} />
      </View>
      <View style={tw`flex-1 pr-2`}>
        <Text style={[tw`font-nunito-semibold text-[14px]`, { color: c.title }]}>{t('personal.connectedWith', { provider: label })}</Text>
        <Text style={[tw`font-nunito text-[11px] mt-[3px]`, { color: c.muted }]}>
          {email ?? t('personal.noEmail', { provider: label })}
        </Text>
      </View>
      <MaterialCommunityIcons name='check-circle' size={22} color={c.accent} />
    </View>
  )
}
