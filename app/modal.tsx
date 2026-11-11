import { AddDuaOptionRow } from '@/components/ui/add-dua-option-row'
import { useColorScheme } from '@/hooks/use-color-scheme'
import {
  isValidReference,
  REFERENCE_PLACEHOLDERS,
  SOURCE_LABELS,
} from '@/lib/dua-utils'
import tw from '@/lib/tailwind'
import { addDua, type Dua, type DuaSource } from '@/redux/reducers/duasSlice'
import type { RootState } from '@/redux/store'
import { BerkshireSwash_400Regular } from '@expo-google-fonts/berkshire-swash'
import {
  NunitoSans_400Regular,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.5

export default function AddDuaModal() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const router = useRouter()
  const dispatch = useDispatch()
  const language = useSelector((state: RootState) => state.settings.language)

  const [fontsLoaded] = useFonts({
    BerkshireSwash_400Regular,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  })

  const [title, setTitle] = useState('')
  const [arabicText, setArabicText] = useState('')
  const [translation, setTranslation] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'General',
  ])
  const [source, setSource] = useState<DuaSource | null>(null)
  const [reference, setReference] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<
    'upload' | 'ai' | 'manual' | null
  >(null)

  const categoryOptions = [
    'General',
    'Morning',
    'Evening',
    'Prayer',
    'Quranic',
    'Night',
  ]

  // Select or deselect a category (at least one stays selected)
  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((current) => {
      if (!current.includes(cat)) return [...current, cat]
      return current.length > 1 ? current.filter((c) => c !== cat) : current
    })
  }, [])

  // Tap the selected source again to clear it (and its reference)
  const toggleSource = useCallback((value: DuaSource) => {
    setSource((current) => (current === value ? null : value))
    setReference('')
  }, [])

  const handleAddDua = useCallback(() => {
    if (!title.trim() || !arabicText.trim() || !translation.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields')
      return
    }

    if (source && reference.trim() && !isValidReference(source, reference)) {
      Alert.alert(
        'Invalid Reference',
        `Use a format like ${REFERENCE_PLACEHOLDERS[source]}`
      )
      return
    }

    const newDua: Dua = {
      id: Date.now().toString(),
      title: title.trim(),
      arabicText: arabicText.trim(),
      translations: { [language]: translation.trim() },
      categories: selectedCategories,
      origin: 'manual',
      isFavorite: false,
      ...(source && { source }),
      ...(source && reference.trim() && { reference: reference.trim() }),
    }

    dispatch(addDua(newDua))
    Alert.alert('Success', 'Dua added successfully!')
    router.back()
  }, [
    title,
    arabicText,
    translation,
    selectedCategories,
    source,
    reference,
    language,
    dispatch,
    router,
  ])

  if (!fontsLoaded) {
    return (
      <View
        style={tw`flex-1 items-center justify-center ${isDark ? 'bg-very-dark-bg' : 'bg-light-bg'}`}
      >
        <Text style={tw`${isDark ? 'text-light-grayish-text' : 'text-dark-text'}`}>
          Loading...
        </Text>
      </View>
    )
  }

  const bgColor = isDark ? 'bg-very-dark-bg' : 'bg-light-bg'
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
      {/* Half-screen sheet */}
      <View
        style={[
          tw`absolute left-0 right-0 rounded-t-3xl overflow-hidden`,
          {
            height: SHEET_HEIGHT,
            bottom: 0,
            backgroundColor: sheetBg,
          },
        ]}
      >
      <ScrollView
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
              Choose how you'd like to add your dua
            </Text>

            <View style={tw`mt-4`}>
              <AddDuaOptionRow
                type='upload'
                title='Upload Image'
                description='Scan screenshot or camera text'
                onPress={() => setSelectedMethod('upload')}
              />
              <AddDuaOptionRow
                type='ai'
                title='AI generated Dua'
                description='Ask the AI for the dua you want to add'
                onPress={() => setSelectedMethod('ai')}
              />
              <AddDuaOptionRow
                type='manual'
                title='Manual'
                description='Add Dua using a form'
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
                <Text style={tw`font-semibold ${textColor}`}>Back</Text>
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
                  Coming soon
                </Text>
              </View>
            ) : (
              <>
            {/* Title */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                Title *
              </Text>
              <TextInput
                placeholder='Enter dua title'
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={title}
                onChangeText={setTitle}
                style={tw`p-3 rounded-lg border ${borderColor} ${inputBgColor} ${textColor}`}
              />
            </View>

            {/* Arabic Text */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                Arabic Text *
              </Text>
              <TextInput
                placeholder='Enter Arabic dua text'
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={arabicText}
                onChangeText={setArabicText}
                multiline
                numberOfLines={4}
                style={[tw`p-3 rounded-lg border ${borderColor} ${inputBgColor} ${textColor}`, { textAlign: 'right' }]}
              />
            </View>

            {/* Translation (saved in the language chosen in Settings) */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                Translation *
              </Text>
              <TextInput
                placeholder='Enter translation'
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={translation}
                onChangeText={setTranslation}
                multiline
                numberOfLines={4}
                style={tw`p-3 rounded-lg border ${borderColor} ${inputBgColor} ${textColor}`}
              />
            </View>

            {/* Categories (a dua can belong to several) */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                Categories
              </Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {categoryOptions.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => toggleCategory(cat)}
                    style={({ pressed }) => [
                      tw`px-4 py-2 rounded-full border ${borderColor} ${selectedCategories.includes(cat) ? 'bg-dark-emerald' : inputBgColor}`,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text
                      style={tw`text-sm font-semibold ${selectedCategories.includes(cat) ? 'text-light-grayish-text' : textColor}`}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Source (optional) */}
            <View style={tw`mb-5`}>
              <Text style={tw`text-sm font-semibold ${textColor} mb-2`}>
                Source (optional)
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
                Reference (optional)
              </Text>
              <TextInput
                placeholder={
                  source ? REFERENCE_PLACEHOLDERS[source] : 'Choose a source first'
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
                  Cancel
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
                  Add Dua
                </Text>
              </Pressable>
            </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
      </View>
    </View>
  )
}
