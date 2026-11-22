import { CollectionField } from '@/components/add-dua/collection-field'
import { ExistingDuaPicker } from '@/components/add-dua/existing-dua-picker'
import { FormField, FormInput } from '@/components/add-dua/form-field'
import { AddDuaOptionRow } from '@/components/ui/add-dua-option-row'
import { Dropdown } from '@/components/ui/dropdown'
import { useAddDuaColors } from '@/hooks/use-add-dua-colors'
import { useCollectionChoice, type ChosenCollections } from '@/hooks/use-collection-choice'
import { useDuplicateDuaGuard } from '@/hooks/use-duplicate-dua-guard'
import { useT } from '@/hooks/use-t'
import {
  createDuaId,
  isValidReference,
  REFERENCE_PLACEHOLDERS,
  SOURCE_LABELS,
} from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import type { Dua, DuaSource } from '@/redux/reducers/duasSlice'
import type { AppDispatch, RootState } from '@/redux/store'
import { createDuaInCollections, saveExistingDuasToCollections } from '@/redux/thunks'
import { BerkshireSwash_400Regular } from '@expo-google-fonts/berkshire-swash'
import {
  NunitoSans_400Regular,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans'
import { useFonts } from 'expo-font'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

/** Manual form: a dua that is not in the app yet, or duas that already are. */
type DuaMode = 'new' | 'existing'

export default function AddDuaModal() {
  const c = useAddDuaColors()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const language = useSelector((state: RootState) => state.settings.translationLanguage)
  const t = useT()
  // Opened from a collection's "Add dua": the dua goes into that collection
  const { collection } = useLocalSearchParams<{ collection?: string }>()
  const collections = useCollectionChoice(collection)

  const [fontsLoaded] = useFonts({
    BerkshireSwash_400Regular,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  })

  const [duaMode, setDuaMode] = useState<DuaMode>('new')
  // "Existing": the ids of the duas picked from the list
  const [existingDuaIds, setExistingDuaIds] = useState<string[]>([])
  // "New": the form fields
  const [title, setTitle] = useState('')
  const [arabicText, setArabicText] = useState('')
  const [transliteration, setTransliteration] = useState('')
  const [translation, setTranslation] = useState('')
  const [source, setSource] = useState<DuaSource | null>(null)
  const [reference, setReference] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<
    'upload' | 'ai' | 'manual' | null
  >(null)

const sheetHeight = useRef(new Animated.Value(SCREEN_HEIGHT * 0.5)).current

useEffect(() => {
  Animated.timing(sheetHeight, {
    toValue:
      SCREEN_HEIGHT *
      (duaMode === 'existing' ? 0.86 : selectedMethod === 'manual' ? 0.8 : 0.4),
    duration: 300,
    easing: Easing.out(Easing.ease),
    useNativeDriver: false,
  }).start()
}, [duaMode, selectedMethod, sheetHeight])

  const toggleExistingDua = useCallback((id: string) => {
    setExistingDuaIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
  }, [])

  // The user chose the dua that already exists instead of adding a copy: switch to "Existing" with
  // it selected. The collections they picked stay as they are (they are shared by both forms)
  const duplicateGuard = useDuplicateDuaGuard((existing) => {
    setDuaMode('existing')
    setExistingDuaIds((current) => (current.includes(existing.id) ? current : [...current, existing.id]))
  })

  // Tap the selected source again to clear it (and its reference)
  const toggleSource = useCallback((value: DuaSource) => {
    setSource((current) => (current === value ? null : value))
    setReference('')
  }, [])

  /** The collections to save into, or null (with a message shown) when the form cannot be saved yet. */
  const requireCollections = (): ChosenCollections | null => {
    const chosen = collections.resolve()
    if (!chosen) return null
    // A dua always belongs to at least one of the user's collections
    if (chosen.isEmpty) {
      Alert.alert(t('addDua.chooseCollectionTitle'), t('addDua.chooseCollectionBody'))
      return null
    }
    return chosen
  }

  /** Shows the result of a save: a message and close the form, or an error and stay. */
  const finishSave = (saved: boolean, successBody: string) => {
    if (!saved) {
      Alert.alert(t('addDua.saveFailedTitle'), t('addDua.saveFailedBody'))
      return
    }
    Alert.alert(t('addDua.successTitle'), successBody)
    router.back()
  }

  // The dua and its new collections are saved in one step: either both exist afterwards or neither
  // does. Backing out of the form (Cancel, the X, the backdrop) never reaches this point, so a
  // collection typed with "+" is simply forgotten
  const saveNewDua = (chosen: ChosenCollections) => {
    const newDua: Dua = {
      id: createDuaId(),
      title: title.trim(),
      arabicText: arabicText.trim(),
      ...(transliteration.trim() && { transliteration: transliteration.trim() }),
      translations: { [language]: translation.trim() },
      // The user's collections list their duas themselves (`duaIds`); `collection` is for pre-made ones
      collection: [],
      origin: 'manual',
      isFavorite: false,
      ...(source && { source }),
      ...(source && reference.trim() && { reference: reference.trim() }),
    }
    finishSave(
      dispatch(createDuaInCollections(newDua, chosen.existingIds, chosen.newCollections)),
      t('addDua.successBody'),
    )
  }

  const handleAddNewDua = () => {
    if (!title.trim() || !arabicText.trim() || !translation.trim()) {
      Alert.alert(t('addDua.missingTitle'), t('addDua.missingBody'))
      return
    }

    if (source && reference.trim() && !isValidReference(source, reference)) {
      Alert.alert(
        t('addDua.invalidRefTitle'),
        t('addDua.invalidRefBody', { format: REFERENCE_PLACEHOLDERS[source] }),
      )
      return
    }

    const chosen = requireCollections()
    if (!chosen) return

    // Last step before saving: is it already in the app? (Image and AI do the same once their
    // Arabic text is extracted or generated: duplicateGuard.checkBeforeSave(text, save))
    duplicateGuard.checkBeforeSave(arabicText, () => saveNewDua(chosen))
  }

  const handleAddExistingDuas = () => {
    if (existingDuaIds.length === 0) {
      Alert.alert(t('addDua.chooseDuaTitle'), t('addDua.chooseDuaBody'))
      return
    }
    const chosen = requireCollections()
    if (!chosen) return

    finishSave(
      dispatch(saveExistingDuasToCollections(existingDuaIds, chosen.existingIds, chosen.newCollections)),
      t('addDua.existingSuccessBody', { count: existingDuaIds.length }),
    )
  }

  if (!fontsLoaded) {
    return (
      <View style={tw`flex-1 items-center justify-center ${c.isDark ? 'bg-very-dark-bg' : 'bg-light-bg'}`}>
        <Text style={tw`${c.text}`}>{t('common.loading')}</Text>
      </View>
    )
  }

  const sheetBg = c.isDark ? '#00242F' : '#FFFFFF'

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
      <Animated.View
        style={[
          tw`left-0 right-0 rounded-t-3xl overflow-hidden`,
          {
            height: sheetHeight,
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
              style={[tw`text-lg font-bold ${c.text} mb-2 text-center`, { paddingHorizontal: 8 }]}
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
                <Text style={tw`text-2xl mr-2 ${c.text}`}>‹</Text>
                <Text style={tw`font-semibold ${c.text}`}>{t('common.back')}</Text>
              </Pressable>
              <Pressable onPress={() => router.back()} style={tw`p-2`}>
                <Text style={tw`text-xl ${c.text}`}>✕</Text>
              </Pressable>
            </View>

            {selectedMethod !== 'manual' ? (
              // Upload and AI: once the Arabic is extracted or generated, run
              // duplicateGuard.checkBeforeSave(arabic, save) before saving, like the manual form
              <View style={tw`py-8`}>
                <Text style={tw`text-center ${c.muted}`}>{t('addDua.comingSoon')}</Text>
              </View>
            ) : (
              <>
                <View style={tw`mb-5`}>
                  <Dropdown
                    label={t('addDua.modeLabel')}
                    value={duaMode}
                    onChange={setDuaMode}
                    options={[
                      { value: 'existing', label: t('addDua.modeExisting') },
                      { value: 'new', label: t('addDua.modeNew') },
                    ]}
                  />
                </View>

                {duaMode === 'existing' ? (
                  <ExistingDuaPicker selectedIds={existingDuaIds} onToggle={toggleExistingDua} />
                ) : (
                  <>
                    <FormField label={t('addDua.titleLabel')}>
                      <FormInput
                        placeholder={t('addDua.titlePlaceholder')}
                        value={title}
                        onChangeText={setTitle}
                      />
                    </FormField>

                    <FormField label={t('addDua.arabicLabel')}>
                      <FormInput
                        arabic
                        placeholder={t('addDua.arabicPlaceholder')}
                        value={arabicText}
                        onChangeText={setArabicText}
                        multiline
                        numberOfLines={4}
                      />
                    </FormField>

                    <FormField label={t('addDua.transliterationLabel')}>
                      <FormInput
                        placeholder={t('addDua.transliterationPlaceholder')}
                        value={transliteration}
                        onChangeText={setTransliteration}
                        multiline
                        numberOfLines={3}
                      />
                    </FormField>

                    {/* Translation (saved in the language chosen in Settings) */}
                    <FormField label={t('addDua.translationLabel')}>
                      <FormInput
                        placeholder={t('addDua.translationPlaceholder')}
                        value={translation}
                        onChangeText={setTranslation}
                        multiline
                        numberOfLines={4}
                      />
                    </FormField>
                  </>
                )}

                <CollectionField choice={collections} last={duaMode === 'existing'} />

                {duaMode === 'new' && (
                  <>
                    {/* Source (optional) */}
                    <FormField label={t('addDua.source')}>
                      <View style={tw`flex-row flex-wrap gap-2`}>
                        {(Object.keys(SOURCE_LABELS) as DuaSource[]).map((value) => (
                          <Pressable
                            key={value}
                            onPress={() => toggleSource(value)}
                            style={({ pressed }) => [
                              tw`px-4 py-2 rounded-full border ${c.border} ${source === value ? 'bg-dark-emerald' : c.inputBg}`,
                              { opacity: pressed ? 0.8 : 1 },
                            ]}
                          >
                            <Text
                              style={tw`text-sm font-semibold ${source === value ? 'text-light-grayish-text' : c.text}`}
                            >
                              {SOURCE_LABELS[value]}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </FormField>

                    {/* Reference (optional) - placeholder follows the selected source */}
                    <FormField label={t('addDua.reference')} last>
                      <FormInput
                        placeholder={source ? REFERENCE_PLACEHOLDERS[source] : t('addDua.chooseSource')}
                        value={reference}
                        onChangeText={setReference}
                        editable={source !== null}
                      />
                    </FormField>
                  </>
                )}

                {/* Action Buttons */}
                <View style={tw`flex-row gap-3 mb-4`}>
                  <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [
                      tw`flex-1 px-4 py-3 rounded-lg border ${c.inputBg} ${c.border}`,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text style={tw`text-center font-semibold ${c.text}`}>{t('common.cancel')}</Text>
                  </Pressable>

                  <Pressable
                    onPress={duaMode === 'existing' ? handleAddExistingDuas : handleAddNewDua}
                    style={({ pressed }) => [
                      tw`flex-1 px-4 py-3 rounded-lg bg-dark-emerald`,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text style={tw`text-center font-semibold text-light-grayish-text`}>
                      {duaMode === 'existing' ? t('addDua.submitExisting') : t('addDua.submit')}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
      </Animated.View>
      </KeyboardAvoidingView>

      {duplicateGuard.modal}
    </View>
  )
}
