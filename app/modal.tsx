import { AiDuaStep } from '@/components/add-dua/ai-dua-step'
import { AutofillBanner } from '@/components/add-dua/autofill-banner'
import { CollectionField } from '@/components/add-dua/collection-field'
import { ExistingDuaPicker } from '@/components/add-dua/existing-dua-picker'
import { FormField, FormInput } from '@/components/add-dua/form-field'
import { ImageDuaStep } from '@/components/add-dua/image-dua-step'
import { AddDuaOptionRow } from '@/components/ui/add-dua-option-row'
import { Dropdown } from '@/components/ui/dropdown'
import { ToastHost } from '@/components/ui/toast-host'
import { useAddDuaColors } from '@/hooks/use-add-dua-colors'
import { useCollectionChoice, type ChosenCollections } from '@/hooks/use-collection-choice'
import { useDuplicateDuaGuard } from '@/hooks/use-duplicate-dua-guard'
import { useT } from '@/hooks/use-t'
import { useToast } from '@/hooks/use-toast'
import {
  createDuaId,
  isValidReference,
  REFERENCE_PLACEHOLDERS,
  SOURCE_LABELS,
} from '@/lib/dua-utils'
import type { DraftOrigin, DuaDraft } from '@/lib/dua-draft'
import { plainTextToInfo } from '@/lib/rich-text'
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
  TextInput,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

/** Manual form: a dua that is not in the app yet, or duas that already are. */
type DuaMode = 'new' | 'existing'

/** The fields of the form that an image scan or the AI can fill in. */
type AutofillField = 'title' | 'arabicText' | 'transliteration' | 'translation' | 'source' | 'reference' | 'notes'

export default function AddDuaModal() {
  const c = useAddDuaColors()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const language = useSelector((state: RootState) => state.settings.translationLanguage)
  const t = useT()
  const toast = useToast()
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
  const [notes, setNotes] = useState('')
  // Image and AI fill in this same form (like an autofill) and are saved as a dua with that origin
  const [draftOrigin, setDraftOrigin] = useState<DraftOrigin | null>(null)
  // The fields that still hold what the image or the AI put there. A field leaves the set once the user edits it
  const [autofilled, setAutofilled] = useState<ReadonlySet<AutofillField>>(new Set())
  // The source and reference that came from the image or the AI stay locked until the user confirms a change
  const [sourceLocked, setSourceLocked] = useState(false)
  const referenceInput = useRef<TextInput>(null)
  // What was asked on the AI screen (kept so "Back" from the filled-in form finds it again)
  const [aiPrompt, setAiPrompt] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<
    'upload' | 'ai' | 'manual' | null
  >(null)

const sheetHeight = useRef(new Animated.Value(SCREEN_HEIGHT * 0.5)).current

useEffect(() => {
  const fraction =
    selectedMethod === 'manual'
      ? duaMode === 'existing'
        ? 0.86
        : 0.8
      : selectedMethod === 'ai'
        ? 0.72
        : selectedMethod === 'upload'
          ? 0.62
          : 0.4
  Animated.timing(sheetHeight, {
    toValue: SCREEN_HEIGHT * fraction,
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

  /** The user changed a field: it no longer holds what the image or the AI put there. */
  const clearAutofill = useCallback((...fields: AutofillField[]) => {
    setAutofilled((current) => {
      if (!fields.some((field) => current.has(field))) return current
      const next = new Set(current)
      fields.forEach((field) => next.delete(field))
      return next
    })
  }, [])

  /** The user types in a field: set it, and it is no longer "auto-filled". */
  const editField = (field: AutofillField, setter: (value: string) => void) => (value: string) => {
    setter(value)
    clearAutofill(field)
  }

  /** Fills the form with what the image scan or the AI returned. Both end up in this same form to be checked and edited. */
  const applyDraft = (draft: DuaDraft, origin: DraftOrigin) => {
    setTitle(draft.title)
    setArabicText(draft.arabicText)
    setTransliteration(draft.transliteration ?? '')
    setTranslation(draft.translation)
    setSource(draft.source ?? null)
    setReference(draft.reference ?? '')
    setNotes(draft.notes ?? '')

    const filled = new Set<AutofillField>()
    if (draft.title) filled.add('title')
    filled.add('arabicText')
    if (draft.transliteration) filled.add('transliteration')
    if (draft.translation) filled.add('translation')
    if (draft.source) filled.add('source')
    if (draft.reference) filled.add('reference')
    if (draft.notes) filled.add('notes')

    setAutofilled(filled)
    setSourceLocked(!!draft.source)
    setDraftOrigin(origin)
    setDuaMode('new')
    setSelectedMethod('manual')
  }

  /** Empties the form and forgets where it came from (leaving the image or AI screen for the method list). */
  const resetForm = () => {
    setTitle('')
    setArabicText('')
    setTransliteration('')
    setTranslation('')
    setSource(null)
    setReference('')
    setNotes('')
    setAiPrompt('')
    setDraftOrigin(null)
    setAutofilled(new Set())
    setSourceLocked(false)
  }

  // Back: from a filled-in form to the image or AI screen it came from, otherwise to the list of methods
  const goBack = () => {
    if (selectedMethod === 'manual' && draftOrigin) {
      setSelectedMethod(draftOrigin === 'image' ? 'upload' : 'ai')
      return
    }
    if (draftOrigin) resetForm()
    setSelectedMethod(null)
  }

  /**
   * The source and reference of an image or AI dua are locked: changing them asks "are you sure?" once, and after
   * "Yes" they are the user's own. (A source check on the backend is planned, see the README's To do.)
   */
  const confirmSourceChange = (change: () => void) => {
    if (!sourceLocked) {
      change()
      return
    }
    Alert.alert(
      t('addDua.sourceLock.title'),
      t(draftOrigin === 'ai' ? 'addDua.sourceLock.aiBody' : 'addDua.sourceLock.imageBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('addDua.sourceLock.change'),
          style: 'destructive',
          onPress: () => {
            setSourceLocked(false)
            clearAutofill('source', 'reference')
            change()
          },
        },
      ],
    )
  }

  // Tap the selected source again to clear it (and its reference)
  const toggleSource = useCallback(
    (value: DuaSource) =>
      confirmSourceChange(() => {
        setSource((current) => (current === value ? null : value))
        setReference('')
        clearAutofill('source', 'reference')
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sourceLocked, draftOrigin, clearAutofill, t],
  )

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
    toast.success(successBody)
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
      origin: draftOrigin ?? 'manual',
      isFavorite: false,
      ...(source && { source }),
      ...(source && reference.trim() && { reference: reference.trim() }),
      ...(notes.trim() && { info: plainTextToInfo(notes) }),
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
      {/* This screen covers the app's own toasts, so it draws them itself */}
      <ToastHost />
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
                onPress={goBack}
                style={({ pressed }) => [tw`flex-row items-center`, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={tw`text-2xl mr-2 ${c.text}`}>‹</Text>
                <Text style={tw`font-semibold ${c.text}`}>{t('common.back')}</Text>
              </Pressable>
              <Pressable onPress={() => router.back()} style={tw`p-2`}>
                <Text style={tw`text-xl ${c.text}`}>✕</Text>
              </Pressable>
            </View>

            {selectedMethod === 'upload' ? (
              // Image and AI hand a draft to the manual form (applyDraft), which then runs the same checks (the
              // duplicate check included) and saves
              <ImageDuaStep language={language} onDraft={(draft) => applyDraft(draft, 'image')} />
            ) : selectedMethod === 'ai' ? (
              <AiDuaStep
                language={language}
                prompt={aiPrompt}
                onPromptChange={setAiPrompt}
                onDraft={(draft) => applyDraft(draft, 'ai')}
              />
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
                    {draftOrigin && <AutofillBanner origin={draftOrigin} />}

                    <FormField label={t('addDua.titleLabel')} autofilled={autofilled.has('title')}>
                      <FormInput
                        placeholder={t('addDua.titlePlaceholder')}
                        value={title}
                        onChangeText={editField('title', setTitle)}
                      />
                    </FormField>

                    <FormField label={t('addDua.arabicLabel')} autofilled={autofilled.has('arabicText')}>
                      <FormInput
                        arabic
                        placeholder={t('addDua.arabicPlaceholder')}
                        value={arabicText}
                        onChangeText={editField('arabicText', setArabicText)}
                        multiline
                        numberOfLines={4}
                      />
                    </FormField>

                    <FormField label={t('addDua.transliterationLabel')} autofilled={autofilled.has('transliteration')}>
                      <FormInput
                        placeholder={t('addDua.transliterationPlaceholder')}
                        value={transliteration}
                        onChangeText={editField('transliteration', setTransliteration)}
                        multiline
                        numberOfLines={3}
                      />
                    </FormField>

                    {/* Translation (saved in the language chosen in Settings) */}
                    <FormField label={t('addDua.translationLabel')} autofilled={autofilled.has('translation')}>
                      <FormInput
                        placeholder={t('addDua.translationPlaceholder')}
                        value={translation}
                        onChangeText={editField('translation', setTranslation)}
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
                    <FormField label={t('addDua.source')} autofilled={autofilled.has('source')}>
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

                    {/* Reference (optional) - placeholder follows the selected source. Locked like the source when it
                        came from the image or the AI: tapping it asks first */}
                    <FormField label={t('addDua.reference')} autofilled={autofilled.has('reference')}>
                      <Pressable
                        disabled={!sourceLocked}
                        onPress={() => confirmSourceChange(() => setTimeout(() => referenceInput.current?.focus(), 80))}
                      >
                        <View pointerEvents={sourceLocked ? 'none' : 'auto'}>
                          <FormInput
                            inputRef={referenceInput}
                            placeholder={source ? REFERENCE_PLACEHOLDERS[source] : t('addDua.chooseSource')}
                            value={reference}
                            onChangeText={editField('reference', setReference)}
                            editable={source !== null && !sourceLocked}
                          />
                        </View>
                      </Pressable>
                    </FormField>

                    {/* Notes (optional): background or context, saved as the dua's note */}
                    <FormField label={t('addDua.notesLabel')} autofilled={autofilled.has('notes')} last>
                      <FormInput
                        placeholder={t('addDua.notesPlaceholder')}
                        value={notes}
                        onChangeText={editField('notes', setNotes)}
                        multiline
                        numberOfLines={3}
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
