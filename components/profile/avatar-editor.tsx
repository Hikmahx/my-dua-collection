import { AvatarCircle } from '@/components/avatar/avatar-circle'
import { ColorSwatches } from '@/components/profile/color-swatches'
import { SegmentedControl } from '@/components/settings/segmented-control'
import {
  AVATAR_COLOR_FIELDS,
  AVATAR_PALETTES,
  type AvatarConfig,
  type AvatarGender,
} from '@/constants/avatar-config'
import tw from '@/lib/tailwind'
import { View } from 'react-native'

const GENDERS: { id: AvatarGender; label: string }[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
]

interface AvatarEditorProps {
  value: AvatarConfig
  onChange: (next: AvatarConfig) => void
}

/** A live preview, the male / female choice, and a row of colors for each part of the avatar. */
export function AvatarEditor({ value, onChange }: AvatarEditorProps) {
  return (
    <View style={tw`py-4`}>
      <View style={tw`items-center mb-4`}>
        <AvatarCircle config={value} size={112} />
      </View>

      <SegmentedControl
        options={GENDERS}
        value={value.gender}
        onChange={(gender) => onChange({ ...value, gender })}
        accessibilityLabel='Avatar gender'
      />

      {AVATAR_COLOR_FIELDS.filter((field) => !field.gender || field.gender === value.gender).map((field) => (
        <ColorSwatches
          key={field.key}
          label={field.label}
          colors={AVATAR_PALETTES[field.key]}
          value={value[field.key]}
          onChange={(color) => onChange({ ...value, [field.key]: color })}
        />
      ))}
    </View>
  )
}
