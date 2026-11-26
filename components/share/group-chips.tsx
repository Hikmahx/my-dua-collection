import { KINDRED_GROUP_INFO } from '@/constants/kindred-groups'
import { KINDRED_GROUPS, type KindredGroup } from '@/data/types'
import { useShareColors } from '@/hooks/use-share-colors'
import { useT } from '@/hooks/use-t'
import tw from '@/lib/tailwind'
import { Pressable, Text, View } from 'react-native'

interface GroupChipsProps {
  selected: readonly KindredGroup[]
  onToggle: (group: KindredGroup) => void
}

/** The kindred groups as pills that can be switched on and off (Family, Friends, Mosque, Classmates). */
export function GroupChips({ selected, onToggle }: GroupChipsProps) {
  const c = useShareColors()
  const t = useT()

  return (
    <View style={tw`flex-row flex-wrap justify-center`}>
      {KINDRED_GROUPS.map((group) => {
        const on = selected.includes(group)
        return (
          <Pressable
            key={group}
            onPress={() => onToggle(group)}
            accessibilityRole='button'
            accessibilityState={{ selected: on }}
            style={[
              tw`h-[34px] px-[14px] rounded-full items-center justify-center m-[4px]`,
              { backgroundColor: on ? c.chipActiveBg : c.chipBg },
            ]}
          >
            <Text style={[tw`font-nunito-semibold text-[13px]`, { color: on ? c.chipActiveText : c.chipText }]}>
              {t(KINDRED_GROUP_INFO[group].labelKey)}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
