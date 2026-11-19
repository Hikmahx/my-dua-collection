import { Avatar } from '@/components/avatar/avatar'
import type { AvatarConfig } from '@/constants/avatar-config'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { View } from 'react-native'

/** The round profile picture: the bust sits at the bottom of the circle and is clipped by it. */
export function AvatarCircle({ config, size }: { config: AvatarConfig; size: number }) {
  const c = useSettingsColors()

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        justifyContent: 'flex-end',
        backgroundColor: c.avatarBg,
      }}
    >
      <Avatar config={config} size={size} />
    </View>
  )
}
