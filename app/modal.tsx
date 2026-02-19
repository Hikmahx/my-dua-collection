import { useColorScheme } from '@/hooks/use-color-scheme'
import { addDua } from '@/redux/reducers/duasSlice'
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
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useDispatch } from 'react-redux'

export default function AddDuaModal() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const router = useRouter()
  const dispatch = useDispatch()

  const [fontsLoaded] = useFonts({
    BerkshireSwash_400Regular,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  })

  const [title, setTitle] = useState('')
  const [arabicText, setArabicText] = useState('')
  const [englishTranslation, setEnglishTranslation] = useState('')
  const [category, setCategory] = useState('General')
  const [selectedMethod, setSelectedMethod] = useState<
    'upload' | 'ai' | 'manual' | null
  >(null)

  const categories = [
    'General',
    'Morning',
    'Evening',
    'Prayer',
    'Quranic',
    'Night',
  ]

  const handleAddDua = useCallback(() => {
    if (!title.trim() || !arabicText.trim() || !englishTranslation.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields')
      return
    }

    const newDua = {
      id: Date.now().toString(),
      title: title.trim(),
      arabicText: arabicText.trim(),
      englishTranslation: englishTranslation.trim(),
      category,
      isFavorite: false,
      isUserCreated: true,
    }

    dispatch(addDua(newDua))
    Alert.alert('Success', 'Dua added successfully!')
    router.back()
  }, [title, arabicText, englishTranslation, category, dispatch, router])

  if (!fontsLoaded) {
    return (
      <View
        className={`flex-1 items-center justify-center ${isDark ? 'bg-very-dark-bg' : 'bg-light-bg'}`}
      >
        <Text className='text-dark-text dark:text-light-grayish-text'>
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
  const inputTextColor = isDark ? 'text-light-grayish-text' : 'text-dark-text'
  const borderColor = isDark
    ? 'border-dark-grayish-border'
    : 'border-very-light-grayish-border'

  return (
    <View className={`flex-1 ${bgColor}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className='flex-1'
      >
        {/* Header */}
        <View className='px-6 pt-6 pb-6 flex-row items-center justify-between'>
          <Text className={`text-2xl font-berkshire text-dark-emerald`}>
            Add Dua
          </Text>
          <Pressable onPress={() => router.back()} className='p-2'>
            <Text className='text-2xl'>✕</Text>
          </Pressable>
        </View>

        {/* Method Selection - Only show if not already selected */}
        {!selectedMethod ? (
          <View className='px-6 mb-8'>
            <Text className={`text-lg font-bold ${textColor} mb-4`}>
              Choose how you'd like to add your dua
            </Text>

            {/* Upload Image */}
            <Pressable
              onPress={() => setSelectedMethod('upload')}
              className={`flex-row items-center px-5 py-5 rounded-2xl mb-3 ${inputBgColor} border border-${borderColor}`}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className='w-12 h-12 rounded-full bg-bright-gold items-center justify-center mr-4'>
                <Text className='text-lg'>📷</Text>
              </View>
              <View className='flex-1'>
                <Text className={`font-semibold ${textColor}`}>
                  Upload Image
                </Text>
                <Text
                  className={`text-xs ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
                >
                  Scan screenshot or camera text
                </Text>
              </View>
              <Text className='text-xl'>›</Text>
            </Pressable>

            {/* AI Generated */}
            <Pressable
              onPress={() => setSelectedMethod('ai')}
              className={`flex-row items-center px-5 py-5 rounded-2xl mb-3 ${inputBgColor} border border-${borderColor}`}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className='w-12 h-12 rounded-full bg-bright-gold items-center justify-center mr-4'>
                <Text className='text-lg'>✨</Text>
              </View>
              <View className='flex-1'>
                <Text className={`font-semibold ${textColor}`}>
                  AI generated Dua
                </Text>
                <Text
                  className={`text-xs ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
                >
                  Ask the AI for the dua you want to add
                </Text>
              </View>
              <Text className='text-xl'>›</Text>
            </Pressable>

            {/* Manual */}
            <Pressable
              onPress={() => setSelectedMethod('manual')}
              className={`flex-row items-center px-5 py-5 rounded-2xl ${inputBgColor} border border-${borderColor}`}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className='w-12 h-12 rounded-full bg-bright-gold items-center justify-center mr-4'>
                <Text className='text-lg'>✍️</Text>
              </View>
              <View className='flex-1'>
                <Text className={`font-semibold ${textColor}`}>Manual</Text>
                <Text
                  className={`text-xs ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
                >
                  Add Dua using a form
                </Text>
              </View>
              <Text className='text-xl'>›</Text>
            </Pressable>
          </View>
        ) : (
          /* Manual Form */
          <View className='px-6'>
            <Pressable
              onPress={() => setSelectedMethod(null)}
              className='flex-row items-center mb-6'
            >
              <Text className='text-2xl mr-2'>‹</Text>
              <Text className={`font-semibold ${textColor}`}>Back</Text>
            </Pressable>

            {/* Title */}
            <View className='mb-5'>
              <Text className={`text-sm font-semibold ${textColor} mb-2`}>
                Title *
              </Text>
              <TextInput
                placeholder='Enter dua title'
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={title}
                onChangeText={setTitle}
                className={`p-3 rounded-lg border border-${borderColor} ${inputBgColor} ${inputTextColor}`}
              />
            </View>

            {/* Arabic Text */}
            <View className='mb-5'>
              <Text className={`text-sm font-semibold ${textColor} mb-2`}>
                Arabic Text *
              </Text>
              <TextInput
                placeholder='Enter Arabic dua text'
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={arabicText}
                onChangeText={setArabicText}
                multiline
                numberOfLines={4}
                className={`p-3 rounded-lg border border-${borderColor} ${inputBgColor} ${inputTextColor}`}
                style={{ textAlign: 'right' }}
              />
            </View>

            {/* English Translation */}
            <View className='mb-5'>
              <Text className={`text-sm font-semibold ${textColor} mb-2`}>
                English Translation *
              </Text>
              <TextInput
                placeholder='Enter English translation'
                placeholderTextColor={isDark ? '#A0A0A0' : '#666666'}
                value={englishTranslation}
                onChangeText={setEnglishTranslation}
                multiline
                numberOfLines={4}
                className={`p-3 rounded-lg border border-${borderColor} ${inputBgColor} ${inputTextColor}`}
              />
            </View>

            {/* Category */}
            <View className='mb-8'>
              <Text className={`text-sm font-semibold ${textColor} mb-2`}>
                Category
              </Text>
              <View className='flex-row flex-wrap gap-2'>
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full ${
                      category === cat ? 'bg-dark-emerald' : inputBgColor
                    } border border-${borderColor}`}
                    style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        category === cat ? 'text-light-grayish-text' : textColor
                      }`}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View className='flex-row gap-3 mb-4'>
              <Pressable
                onPress={() => router.back()}
                className={`flex-1 px-4 py-3 rounded-lg ${inputBgColor} border border-${borderColor}`}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <Text className={`text-center font-semibold ${textColor}`}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleAddDua}
                className='flex-1 px-4 py-3 rounded-lg bg-dark-emerald'
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <Text className='text-center font-semibold text-light-grayish-text'>
                  Add Dua
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
