import { AvatarCircle } from '@/components/avatar/avatar-circle'
import { GROUP_ICON_SIZE } from '@/components/share/share-layout'
import { PickerTile, TILE_CIRCLE } from '@/components/share/picker-tile'
import { KINDRED_GROUP_INFO } from '@/constants/kindred-groups'
import { KINDRED_GROUPS, type User } from '@/data/types'
import { useShareColors } from '@/hooks/use-share-colors'
import { useT } from '@/hooks/use-t'
import type { SharePicker } from '@/hooks/use-share-picker'
import { countByGroup, shortName } from '@/lib/kindred'
import { matchesSearch } from '@/lib/search'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import { FlatList, Text, View } from 'react-native'

type Item = { key: string; kind: 'code' } | { key: string; kind: 'person'; user: User; oneOff: boolean }

/** The dashed "+" circle that starts the Add by code flow. */
function AddByCodeCircle() {
  const c = useShareColors()
  return (
    <View
      style={[
        tw`items-center justify-center rounded-full`,
        { width: TILE_CIRCLE, height: TILE_CIRCLE, borderWidth: 2, borderStyle: 'dashed', borderColor: c.accent },
      ]}
    >
      <Feather name='plus' size={GROUP_ICON_SIZE} color={c.accent} />
    </View>
  )
}

function EmptyMessage({ title, body }: { title: string; body?: string }) {
  const c = useShareColors()
  return (
    <View style={tw`items-center px-[28px] pt-[24px]`}>
      <Text style={[tw`font-nunito-bold text-[15px] text-center`, { color: c.text }]}>{title}</Text>
      {body ? <Text style={[tw`font-nunito text-[13px] leading-[19px] text-center mt-[6px]`, { color: c.muted }]}>{body}</Text> : null}
    </View>
  )
}

/**
 * The middle of the share sheet: a scrolling grid of three columns, either your kindred (with
 * "Add by code" first) or your groups. Tap to pick; tapping a group picks everyone in it.
 */
export function KindredGrid({ picker }: { picker: SharePicker }) {
  const c = useShareColors()
  const t = useT()

  if (picker.mode === 'groups') {
    const counts = countByGroup(picker.entries)
    const groups = KINDRED_GROUPS.filter((group) => matchesSearch(picker.query, [t(KINDRED_GROUP_INFO[group].labelKey)]))
    return (
      <FlatList
        key='groups'
        data={groups}
        numColumns={3}
        keyExtractor={(group) => group}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={tw`px-[12px] pb-[12px]`}
        ListEmptyComponent={<EmptyMessage title={t('share.noMatches', { query: picker.query })} />}
        renderItem={({ item: group }) => {
          const info = KINDRED_GROUP_INFO[group]
          return (
            <PickerTile
              label={t(info.labelKey)}
              caption={t('share.groupMembers', { count: counts[group] })}
              selection={picker.pickedGroups.has(group) ? 'all' : 'none'}
              onPress={() => picker.toggleGroupPick(group)}
            >
              <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: c.tileBg }]}>
                <Feather name={info.icon} size={GROUP_ICON_SIZE} color={c.accent} />
              </View>
            </PickerTile>
          )
        }}
      />
    )
  }

  const people: Item[] = [
    ...picker.oneOff.filter((user) => matchesSearch(picker.query, [user.firstName, user.lastName])).map((user) => ({ key: user.id, kind: 'person' as const, user, oneOff: true })),
    ...picker.visibleEntries.map((entry) => ({ key: entry.user.id, kind: 'person' as const, user: entry.user, oneOff: false })),
  ]
  const items: Item[] = [{ key: 'code', kind: 'code' }, ...people]

  return (
    <FlatList
      key='people'
      data={items}
      numColumns={3}
      keyExtractor={(item) => item.key}
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={tw`px-[12px] pb-[12px]`}
      ListFooterComponent={
        people.length === 0 ? (
          picker.query ? (
            <EmptyMessage title={t('share.noMatches', { query: picker.query })} />
          ) : (
            <EmptyMessage title={t('share.noKindred')} body={t('share.noKindredHint')} />
          )
        ) : null
      }
      renderItem={({ item }) =>
        item.kind === 'code' ? (
          <PickerTile label={t('share.addByCode')} onPress={() => picker.setMode('code')}>
            <AddByCodeCircle />
          </PickerTile>
        ) : (
          <PickerTile
            label={shortName(item.user)}
            caption={item.oneOff ? t('share.oneOff') : undefined}
            selection={picker.isPicked(item.user.id) ? 'all' : 'none'}
            onPress={() => picker.togglePerson(item.user.id)}
          >
            <AvatarCircle config={item.user.avatar} size={TILE_CIRCLE} />
          </PickerTile>
        )
      }
    />
  )
}
