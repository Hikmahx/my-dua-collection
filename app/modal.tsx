import { useT } from '@/hooks/use-t'
import { AddDuaOptionRow } from '@/components/ui/add-dua-option-row'
import { useArabicFont } from '@/hooks/use-arabic-font'
import { useCollections } from '@/hooks/use-collections'
import { useNewCollectionInput } from '@/hooks/use-new-collection-input'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { createCollectionId } from '@/lib/collection-utils'
import {
  createDuaId,
  isValidReference,
  REFERENCE_PLACEHOLDERS,
  SOURCE_LABELS,
} from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import type { Dua, DuaSource } from '@/redux/reducers/duasSlice'
import type { AppDispatch, RootState } from '@/redux/store'
import { createDuaInCollections } from '@/redux/thunks'
import { BerkshireSwash_400Regular } from '@expo-google-fonts/berkshire-swash'
import {
  NunitoSans_400Regular,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans'
import { Feather } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.5

/** A collection made in this form. It is only created, with the dua in it, when the dua is saved. */
interface PendingCollection {
  id: string
  name: string
}

export default function AddDuaModal() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const language = useSelector((state: RootState) => state.settings.translationLanguage)
  const arabicFont = useArabicFont()
  const t = useT()
  // Opened from a collection's "Add dua": the new dua goes into that collection
  const { collection } = useLocalSearchParams<{ collection?: string }>()
  // Only the collections the user made can be chosen here: the pre-made ones are read only
  const { userCollections } = useCollections()

  const [fontsLoaded] = useFonts({
    BerkshireSwash_400Regular,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  })

  const [title, setTitle] = useState('')
  const [arabicText, setArabicText] = useState('')
  const [transliteration, setTransliteration] = useState('')
  const [translation, setTranslation] = useState('')
  // Ids of the chosen collections (the user's own, or one of `pendingCollections`)
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    collection && userCollections.some((c) => c.id === collection) ? [collection] : [],
  )
  // Collections typed with the "+" pill. They only exist in this form until the dua is saved
  const [pendingCollections, setPendingCollections] = useState<PendingCollection[]>([])
  const [source, setSource] = useState<DuaSource | null>(null)
  const [reference, setReference] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<
    'upload' | 'ai' | 'manual' | null
  >(null)

  // Select or deselect a collection (saving needs at least one)
  const toggleCollection = useCallback((id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
  }, [])

  // The name typed after "+": the collection is chosen right away, but only made when the dua is saved
  const newCollection = useNewCollectionInput(
    (name) => {
      const created = { id: createCollectionId(), name }
      setPendingCollections((current) => [...current, created])
      setSelectedIds((current) => [...current, created.id])
    },
    pendingCollections.map((c) => c.name),
  )

  // Tap the selected source again to clear it (and its reference)
  const toggleSource = useCallback((value: DuaSource) => {
    setSource((current) => (current === value ? null : value))
    setReference('')
  }, [])

  const handleAddDua = useCallback(() => {
    if (!title.trim() || !arabicText.trim() || !translation.trim()) {
      Alert.alert(t('addDua.missingTitle'), t('addDua.missingBody'))
      return
    }

    if (source && reference.trim() && !isValidReference(source, reference)) {
      Alert.alert(
        t('addDua.invalidRefTitle'),
        t('addDua.invalidRefBody', { format: REFERENCE_PLACEHOLDERS[source] })
      )
      return
    }

    // A name typed after "+" but not confirmed with the tick yet still counts: it is checked now and
    // made together with the dua (a wrong name is shown under the field and nothing is saved)
    let chosenIds = selectedIds
    let drafts = pendingCollections
    if (newCollection.creating && newCollection.name.trim()) {
      const typed = newCollection.check()
      if (!typed) return
      const created = { id: createCollectionId(), name: typed }
      drafts = [...drafts, created]
      chosenIds = [...chosenIds, created.id]
    }

    // A dua always belongs to at least one of the user's collections
    if (chosenIds.length === 0) {
      Alert.alert(
        t('addDua.chooseCollectionTitle'),
        t('addDua.chooseCollectionBody'),
      )
      return
    }

    // Collections made with "+" and still chosen. The ones that were unchosen again are dropped
    const newCollections = drafts.filter((c) => chosenIds.includes(c.id))

    const newDua: Dua = {
      id: createDuaId(),
      title: title.trim(),
      arabicText: arabicText.trim(),
      ...(transliteration.trim() && { transliteration: transliteration.trim() }),
      translations: { [language]: translation.trim() },
      // The user's collections list their duas themselves (`duaIds`); `categories` is for pre-made ones
      categories: [],
      origin: 'manual',
      isFavorite: false,
      ...(source && { source }),
      ...(source && reference.trim() && { reference: reference.trim() }),
    }

    // The dua and its new collections are saved in one step: either both exist afterwards or neither
    // does. Backing out of the form (Cancel, the X, the backdrop) never reaches this point, so a
    // collection typed with "+" is simply forgotten
    const saved = dispatch(
      createDuaInCollections(
        newDua,
        chosenIds.filter((id) => !newCollections.some((c) => c.id === id)),
        newCollections,
      ),
    )
    if (!saved) {
      Alert.alert(t('addDua.saveFailedTitle'), t('addDua.saveFailedBody'))
      return
    }
    Alert.alert(t('addDua.successTitle'), t('addDua.successBody'))
    router.back()
  }, [
    title,
    arabicText,
    transliteration,
    translation,
    selectedIds,
    pendingCollections,
    newCollection,
    source,
    reference,
    language,
    t,
    dispatch,
    router,
  ])

  if (!fontsLoaded) {
    return (
      <View
        style={tw`flex-1 items-center justify-center ${isDark ? 'bg-very-dark-bg' : 'bg-light-bg'}`}
      >
        <Text style={tw`${isDark ? 'text-light-grayish-text' : 'text-dark-text'}`}>
          {t('common.loading')}
        </Text>
      </View>
    )
  }

  const textColor = isDark ? 'text-light-grayish-text' : 'text-dark-text'
  const inputBgColor = isDark
    ? 'bg-very-dark-nav-bg'
    : 'bg-very-light-grayish-bg'
  const borderColor = isDark
    ? 'border-dark-grayish-border'
    : 'border-very-light-grayish-border'

  const sheetBg = isDark ? '#00242F' : '#FFFFFF'

  return (
    <View style={tw`flex-1`}>
      {/* Faded black backdrop - tap to close */}
      <Pressable
        style={[
          tw`absolute inset-0`,
          { backgroundColor: 'rgba(0,0,0,0.5)' },
        ]}
        onPress={() => router.back()}
      />
      {/* Half-screen sheet (it moves up with the keyboard) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents='box-none'
        style={tw`flex-1 justify-end`}
      >
      <View
        style={[
          tw`left-0 right-0 rounded-t-3xl overflow-hidden`,
          {
            height: SHEET_HEIGHT,
            backgroundColor: sheetBg,
          },
        ]}
      >
      <ScrollView
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        style={tw`flex-1`}
      >
        {/* Method Selection - Only show if not already selected */}
        {!selectedMethod ? (
          <View style={tw`px-6 pt-6`}>
            <Text
              style={[tw`text-lg font-bold ${textColor} mb-2 text-center`, { paddingHorizontal: 8 }]}
            >
              {t('addDua.chooseMethod')}
            </Text>

            <View style={tw`mt-4`}>
              <AddDuaOptionRow
                type='upload'
                title={t('addDua.uploadTitle')}
                description={t('addDua.uploadDesc')}
                onPress={() => setSelectedMethod('upload')}
              />
              <AddDuaOptionRow
                type='ai'
                title={t('addDua.aiTitle')}
                description={t('addDua.aiDesc')}
                onPress={() => setSelectedMethod('ai')}
              />
              <AddDuaOptionRow
                type='manual'
                title={t('addDua.manualTitle')}
                description={t('addDua.manualDesc')}
                onPress={() => setSelectedMethod('manual')}
              />
            </View>
          </View>
        ) : (
          /* Manual Form (or future upload/AI screens) */
          <View style={tw`px-6 pt-6`}>
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <Pressable
                onPress={() => setSelectedMethod(null)}
                style={({ pressed }) => [tw`flex-row items-center`, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={tw`text-2xl mr-2 ${textColor}`}>‹</Text>
                <Text style={tw`font-semibold ${textColor}`}>{t('common.back')}</Text>
              </Pressable>
              <Pressable onPress={() => router.back()} style={tw`p-2`}>
                <Text style={tw`text-xl ${textColor}`}>✕</Text>
              </Pressable>
            </View>

            {selectedMethod !== 'manual' ? (
              <View style={tw`py-8`}>
                <Text
                  style={tw`text-center ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
                >
                  {t('addDua.comingSoon')}
                </Text>
              </View>
            ) : (
              <>
            {/* Title */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                {t('addDua.titleLabel')}
              </Text>
              <TextInput
                placeholder={t('addDua.titlePlaceholder')}
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={title}
                onChangeText={setTitle}
                style={tw`p-3 rounded-lg border ${borderColor} ${inputBgColor} ${textColor}`}
              />
            </View>

            {/* Arabic Text */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                {t('addDua.arabicLabel')}
              </Text>
              <TextInput
                placeholder={t('addDua.arabicPlaceholder')}
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={arabicText}
                onChangeText={setArabicText}
                multiline
                numberOfLines={4}
                style={[tw`p-3 rounded-lg border ${borderColor} ${inputBgColor} ${textColor}`, { textAlign: 'right', fontFamily: arabicFont.family }]}
              />
            </View>

            {/* Transliteration (optional) */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                {t('addDua.transliterationLabel')}
              </Text>
              <TextInput
                placeholder={t('addDua.transliterationPlaceholder')}
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={transliteration}
                onChangeText={setTransliteration}
                multiline
                numberOfLines={3}
                style={tw`p-3 rounded-lg border ${borderColor} ${inputBgColor} ${textColor}`}
              />
            </View>

            {/* Translation (saved in the language chosen in Settings) */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                {t('addDua.translationLabel')}
              </Text>
              <TextInput
                placeholder={t('addDua.translationPlaceholder')}
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={translation}
                onChangeText={setTranslation}
                multiline
                numberOfLines={4}
                style={tw`p-3 rounded-lg border ${borderColor} ${inputBgColor} ${textColor}`}
              />
            </View>

            {/* Categories = the user's own collections (a dua can belong to several). "+" makes a new one. */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                {t('addDua.categories')}
              </Text>
              {userCollections.length === 0 && pendingCollections.length === 0 && !newCollection.creating && (
                <Text
                  style={tw`text-xs mb-2 ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
                >
                  {t('addDua.noCollections')}
                </Text>
              )}
              <View style={tw`flex-row flex-wrap gap-2`}>
                {[...userCollections, ...pendingCollections].map((cat) => {
                  const selected = selectedIds.includes(cat.id)
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => toggleCollection(cat.id)}
                      accessibilityRole='button'
                      accessibilityState={{ selected }}
                      style={({ pressed }) => [
                        tw`px-4 py-2 rounded-full border ${borderColor} ${selected ? 'bg-dark-emerald' : inputBgColor}`,
                        { opacity: pressed ? 0.8 : 1 },
                      ]}
                    >
                      <Text
                        style={tw`text-sm font-semibold ${selected ? 'text-light-grayish-text' : textColor}`}
                      >
                        {cat.name}
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
                      tw`px-4 py-2 rounded-full border ${borderColor} ${inputBgColor} flex-row items-center`,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Feather name='plus' size={16} color={isDark ? '#F3F3F3' : '#1A1A1A'} />
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
                      placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                      value={newCollection.name}
                      onChangeText={newCollection.changeName}
                      maxLength={newCollection.maxLength}
                      returnKeyType='done'
                      onSubmitEditing={newCollection.submit}
                      style={tw`flex-1 p-3 rounded-lg border ${borderColor} ${inputBgColor} ${textColor}`}
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
                      <Feather name='x' size={20} color={isDark ? '#F3F3F3' : '#1A1A1A'} />
                    </Pressable>
                  </View>
                  {newCollection.error && (
                    <Text style={tw`text-xs mt-2 text-red-500`}>{newCollection.error}</Text>
                  )}
                </View>
              )}
            </View>

            {/* Source (optional) */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                {t('addDua.source')}
              </Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {(Object.keys(SOURCE_LABELS) as DuaSource[]).map((value) => (
                  <Pressable
                    key={value}
                    onPress={() => toggleSource(value)}
                    style={({ pressed }) => [
                      tw`px-4 py-2 rounded-full border ${borderColor} ${source === value ? 'bg-dark-emerald' : inputBgColor}`,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text
                      style={tw`text-sm font-semibold ${source === value ? 'text-light-grayish-text' : textColor}`}
                    >
                      {SOURCE_LABELS[value]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Reference (optional) - placeholder follows the selected source */}
            <View style={tw`mb-8`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                {t('addDua.reference')}
              </Text>
              <TextInput
                placeholder={
                  source ? REFERENCE_PLACEHOLDERS[source] : t('addDua.chooseSource')
                }
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={reference}
                onChangeText={setReference}
                editable={source !== null}
                style={tw`p-3 rounded-lg border ${borderColor} ${inputBgColor} ${textColor}`}
              />
            </View>

            {/* Action Buttons */}
            <View style={tw`flex-row gap-3 mb-4`}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                  tw`flex-1 px-4 py-3 rounded-lg border ${inputBgColor} ${borderColor}`,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={tw`text-center font-semibold ${textColor}`}>
                  {t('common.cancel')}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleAddDua}
                style={({ pressed }) => [
                  tw`flex-1 px-4 py-3 rounded-lg bg-dark-emerald`,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={tw`text-center font-semibold text-light-grayish-text`}>
                  {t('addDua.submit')}
                </Text>
              </Pressable>
            </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
      </View>
      </KeyboardAvoidingView>
    </View>
  )
}
