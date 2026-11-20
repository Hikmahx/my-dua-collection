import { useT } from '@/hooks/use-t'
import { AvatarCircle } from '@/components/avatar/avatar-circle'
import { ColorSwatches } from '@/components/profile/color-swatches'
import { SegmentedControl } from '@/components/settings/segmented-control'
import {
  AVATAR_COLOR_FIELDS,
  AVATAR_PALETTES,
  type AvatarColorKey,
  type AvatarConfig,
  type AvatarGender,
} from '@/constants/avatar-config'
import tw from '@/lib/tailwind'
import type { TranslationKey } from '@/locales'
import { View } from 'react-native'

const FIELD_LABEL_KEYS = {
  skin: 'avatar.skin',
  hair: 'avatar.hair',
  shirt: 'avatar.shirt',
  cap: 'avatar.cap',
  hijab: 'avatar.hijab',
} as const satisfies Record<AvatarColorKey, TranslationKey>

interface AvatarEditorProps {
  value: AvatarConfig
  onChange: (next: AvatarConfig) => void
}

/** A live preview, the male / female choice, and a row of colors for each part of the avatar. */
export function AvatarEditor({ value, onChange }: AvatarEditorProps) {
  const t = useT()
  const genders: { id: AvatarGender; label: string }[] = [
    { id: 'male', label: t('avatar.male') },
    { id: 'female', label: t('avatar.female') },
  ]

  return (
    <View style={tw`py-4`}>
      <View style={tw`items-center mb-4`}>
        <AvatarCircle config={value} size={112} />
      </View>

      <SegmentedControl
        options={genders}
        value={value.gender}
        onChange={(gender) => onChange({ ...value, gender })}
        accessibilityLabel={t('avatar.gender')}
      />

      {AVATAR_COLOR_FIELDS.filter((field) => !field.gender || field.gender === value.gender).map((field) => (
        <ColorSwatches
          key={field.key}
          label={t(FIELD_LABEL_KEYS[field.key])}
          colors={AVATAR_PALETTES[field.key]}
          value={value[field.key]}
          onChange={(color) => onChange({ ...value, [field.key]: color })}
        />
      ))}
    </View>
  )
}
