import { AvatarCircle } from '@/components/avatar/avatar-circle'
import type { AvatarConfig } from '@/constants/avatar-config'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import tw from '@/lib/tailwind'
import { Text, View } from 'react-native'

const AVATAR_SIZE = 74

interface ProfileHeaderProps {
  name: string
  avatar: AvatarConfig
  /** e.g. "Today · 5 Jumada al-Akhirah 1448 AH" */
  dateLine: string
  /** e.g. "Google". Shows "Not signed in" when empty. */
  connectedWith?: string
}

/** Avatar, name, today's Hijri date and the connected account, on the header surface. */
export function ProfileHeader({ name, avatar, dateLine, connectedWith }: ProfileHeaderProps) {
  const c = useSettingsColors()

  return (
    <View style={[tw`items-center pt-4 pb-7`, { backgroundColor: c.header }]}>
      <AvatarCircle config={avatar} size={AVATAR_SIZE} />
      <Text style={[tw`font-nunito-extrabold text-[20px] mt-4`, { color: c.title }]}>{name}</Text>
      <Text style={[tw`font-nunito text-[12px] mt-2`, { color: c.accent }]}>{dateLine}</Text>
      <Text style={[tw`font-nunito text-[11px] mt-[6px]`, { color: c.muted }]}>
        {connectedWith ? `Connected with ${connectedWith}` : 'Not signed in'}
      </Text>
    </View>
  )
}
