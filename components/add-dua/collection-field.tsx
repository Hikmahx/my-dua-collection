import { FormField } from '@/components/add-dua/form-field'
import { useAddDuaColors } from '@/hooks/use-add-dua-colors'
import type { CollectionChoice } from '@/hooks/use-collection-choice'
import { useT } from '@/hooks/use-t'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import { Pressable, Text, TextInput, View } from 'react-native'

/**
 * Collection = the user's own collections as pills (a dua can belong to several). "+" makes a new
 * one, which only exists once the form is saved. State comes from `useCollectionChoice`.
 */
export function CollectionField({ choice, last = false }: { choice: CollectionChoice; last?: boolean }) {
  const c = useAddDuaColors()
  const t = useT()
  const { userCollections, pendingCollections, selectedIds, toggle, newCollection } = choice

  return (
    <FormField label={t('addDua.collection')} last={last}>
      {userCollections.length === 0 && pendingCollections.length === 0 && !newCollection.creating && (
        <Text style={tw`text-xs mb-2 ${c.muted}`}>{t('addDua.noCollections')}</Text>
      )}

      <View style={tw`flex-row flex-wrap gap-2`}>
        {[...userCollections, ...pendingCollections].map((collection) => {
          const selected = selectedIds.includes(collection.id)
          return (
            <Pressable
              key={collection.id}
              onPress={() => toggle(collection.id)}
              accessibilityRole='button'
              accessibilityState={{ selected }}
              style={({ pressed }) => [
                tw`px-4 py-2 rounded-full border ${c.border} ${selected ? 'bg-dark-emerald' : c.inputBg}`,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={tw`text-sm font-semibold ${selected ? 'text-light-grayish-text' : c.text}`}>
                {collection.name}
              </Text>
            </Pressable>
          )
        })}

        {/* The "+" pill, always last */}
        {!newCollection.creating && (
          <Pressable
            onPress={newCollection.open}
            accessibilityRole='button'
            accessibilityLabel={t('addDua.newCollectionA11y')}
            style={({ pressed }) => [
              tw`px-4 py-2 rounded-full border ${c.border} ${c.inputBg} flex-row items-center`,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name='plus' size={16} color={c.icon} />
          </Pressable>
        )}
      </View>

      {/* Turns into an input after tapping "+" */}
      {newCollection.creating && (
        <View style={tw`mt-3`}>
          <View style={tw`flex-row items-center gap-2`}>
            <TextInput
              autoFocus
              placeholder={t('newCollection.placeholder')}
              placeholderTextColor={c.placeholder}
              value={newCollection.name}
              onChangeText={newCollection.changeName}
              maxLength={newCollection.maxLength}
              returnKeyType='done'
              onSubmitEditing={newCollection.submit}
              style={tw`flex-1 p-3 rounded-lg border ${c.border} ${c.inputBg} ${c.text}`}
            />
            <Pressable
              onPress={newCollection.submit}
              hitSlop={8}
              accessibilityRole='button'
              accessibilityLabel={t('newCollection.add')}
              style={({ pressed }) => [
                tw`w-[44px] h-[44px] rounded-lg bg-dark-emerald items-center justify-center`,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name='check' size={20} color='#F3F3F3' />
            </Pressable>
            <Pressable
              onPress={newCollection.close}
              hitSlop={8}
              accessibilityRole='button'
              accessibilityLabel={t('newCollection.cancel')}
              style={tw`w-[44px] h-[44px] items-center justify-center`}
            >
              <Feather name='x' size={20} color={c.icon} />
            </Pressable>
          </View>
          {newCollection.error && <Text style={tw`text-xs mt-2 text-red-500`}>{newCollection.error}</Text>}
        </View>
      )}
    </FormField>
  )
}
