import { DuaCard } from '@/components/ui/dua-card'
import { FeaturedDuaBanner } from '@/components/ui/featured-dua-banner'
import { TabSelector } from '@/components/ui/tab-selector'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { RootState } from '@/redux/store'
import { BerkshireSwash_400Regular } from '@expo-google-fonts/berkshire-swash'
import {
  NunitoSans_400Regular,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

export default function HomeScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const router = useRouter()

  const [fontsLoaded] = useFonts({
    BerkshireSwash_400Regular,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  })

  const [activeTab, setActiveTab] = useState('all')

  // Get duas from Redux
  const duas = useSelector((state: RootState) => state.duas.items)

  const tabs = [
    { label: 'All', id: 'all' },
    { label: 'My Collections', id: 'my-collections' },
    { label: 'Pre-made', id: 'pre-made' },
  ]

  // Filter duas based on active tab
  const filteredDuas = useCallback(() => {
    if (activeTab === 'all') return duas
    if (activeTab === 'my-collections')
      return duas.filter((dua) => dua.isUserCreated)
    if (activeTab === 'pre-made')
      return duas.filter((dua) => !dua.isUserCreated)
    return duas
  }, [activeTab, duas])

  const handleAddDua = useCallback(() => {
    router.push('/modal')
  }, [router])

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

  const headerBgColor = isDark ? 'bg-very-dark-bg' : 'bg-light-bg'
  const textColor = isDark ? 'text-light-grayish-text' : 'text-dark-text'

  return (
    <View className='flex-1'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={`flex-1 ${headerBgColor}`}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View
          className={`px-6 pt-6 pb-4 flex-row items-center justify-between`}
        >
          <Text className={`text-2xl font-berkshire text-dark-emerald`}>
            Home
          </Text>
          <Pressable className='p-2' onPress={() => {}}>
            <Text className='text-xl'>⚙️</Text>
          </Pressable>
        </View>

        {/* Featured Banner */}
        <View className='px-6 mb-8'>
          <FeaturedDuaBanner
            title='Quranic Dua'
            arabicText='فَإِن شَكَّ‌تُم أَن شَكَّ‌تُم إِنَّهُ لَا إِلَـٰهَ إِلَّا أَنتَ الظَّالِمِين'
            englishTranslation='There is no deity but You. Indeed, I have been of the wrongdoers.'
            verseReference='Quran 21:87'
            onMoreInfo={() => {}}
          />
        </View>

        {/* Dua Collection Section */}
        <View className='px-6'>
          <Text className={`text-xl font-bold ${textColor} mb-4`}>
            Dua Collection
          </Text>

          {/* Tabs */}
          <View className='mb-6'>
            <TabSelector
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </View>

          {/* Dua Grid */}
          <View className='gap-4 mb-8'>
            {filteredDuas().length > 0 ? (
              <View className='gap-3'>
                {filteredDuas().map((dua, index) => (
                  <DuaCard
                    key={dua.id}
                    title={dua.title}
                    count={11} // Placeholder - can be dynamic later
                    icon={dua.iconPath}
                    verseReference={dua.verseReference}
                    onPress={() => {
                      // Navigate to dua detail screen
                    }}
                  />
                ))}
              </View>
            ) : (
              <Text
                className={`text-center py-8 ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
              >
                No duas in this category
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <View className='absolute bottom-24 right-6'>
        <Pressable
          onPress={handleAddDua}
          className='w-16 h-16 rounded-full bg-dark-emerald items-center justify-center shadow-lg'
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <Text className='text-3xl text-white font-bold'>+</Text>
        </Pressable>
      </View>
    </View>
  )
}
