import { CollectionCard } from '@/components/ui/collection-card'
import { FeaturedDuaBanner } from '@/components/ui/featured-dua-banner'
import { TabSelector } from '@/components/ui/tab-selector'
import { COLLECTION_DEFS } from '@/constants/collections'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { RootState } from '@/redux/store'
import { BerkshireSwash_400Regular } from '@expo-google-fonts/berkshire-swash'
import {
  NunitoSans_400Regular,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native'
import { useSelector } from 'react-redux'

export default function HomeScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const router = useRouter()
  const { width: screenWidth } = useWindowDimensions()

  const [fontsLoaded] = useFonts({
    BerkshireSwash_400Regular,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  })

  const [activeTab, setActiveTab] = useState('all')

  const duas = useSelector((state: RootState) => state.duas.items)

  const tabs = [
    { label: 'All', id: 'all' },
    { label: 'My Collections', id: 'my-collections' },
    { label: 'Pre-made', id: 'pre-made' },
  ]

  // Build collection list with counts; filter by tab
  const collectionsWithCounts = useMemo(() => {
    return COLLECTION_DEFS.map((col) => ({
      ...col,
      count: duas.filter((d) => d.category === col.id).length,
      hasUserCreated: duas.some(
        (d) => d.category === col.id && d.isUserCreated
      ),
      allPreMade: duas
        .filter((d) => d.category === col.id)
        .every((d) => !d.isUserCreated),
    }))
  }, [duas])

  const filteredCollections = useCallback(() => {
    if (activeTab === 'all') return collectionsWithCounts
    if (activeTab === 'my-collections')
      return collectionsWithCounts.filter((c) => c.hasUserCreated)
    if (activeTab === 'pre-made')
      return collectionsWithCounts.filter((c) => c.allPreMade && c.count > 0)
    return collectionsWithCounts
  }, [activeTab, collectionsWithCounts])

  const handleAddDua = useCallback(() => {
    router.push('/modal')
  }, [router])

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

  return (
    <View style={tw`flex-1`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`flex-1 ${isDark ? 'bg-very-dark-bg' : 'bg-light-bg'}`}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={tw`px-6 pt-6 pb-4 flex-row items-center justify-between`}>
          <Text
            style={tw`text-2xl font-bold ${isDark ? 'text-white' : 'text-dark-text'}`}
          >
            Home
          </Text>
          <Pressable
            style={({ pressed }) => [tw`p-2`, { opacity: pressed ? 0.7 : 1 }]}
            onPress={() => {}}
          >
            <MaterialCommunityIcons
              name='tune-variant'
              size={24}
              color={isDark ? '#ECEDEE' : '#11181C'}
            />
          </Pressable>
        </View>

        {/* Featured Banner - full screen width */}
        <View style={[tw`mb-6`, { width: screenWidth }]}>
          <FeaturedDuaBanner
            title='Quranic Dua'
            arabicText='لَّا إِلَهَ إِلَّا أَنتَ سُبْحْنَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ'
            englishTranslation="There is no deity but You. Indeed, I have been of the wrongdoers."
            verseReference='Quran 21:87'
          />
        </View>

        {/* Dua Collection Section */}
        <View style={tw`px-6`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text
              style={tw`text-xl font-bold ${isDark ? 'text-light-grayish-text' : 'text-dark-text'}`}
            >
              Dua Collection
            </Text>
            <TabSelector
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </View>

          {/* Collections Grid (2 columns) */}
          <View style={tw`flex-row flex-wrap gap-3 mb-8`}>
            {filteredCollections().length > 0 ? (
              filteredCollections().map((col) => (
                <View key={col.id} style={{ width: '47%' }}>
                  <CollectionCard
                    title={col.name}
                    count={col.count}
                    iconKey={col.iconKey}
                    onPress={() => {}}
                  />
                </View>
              ))
            ) : (
              <View style={tw`w-full py-8`}>
                <Text
                  style={tw`text-center ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
                >
                  No collections in this category
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <View style={tw`absolute bottom-24 right-6`}>
        <Pressable
          onPress={handleAddDua}
          style={({ pressed }) => [
            tw`w-16 h-16 rounded-full bg-dark-emerald items-center justify-center`,
            { opacity: pressed ? 0.8 : 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
          ]}
        >
          <Text style={tw`text-3xl text-white font-bold`}>+</Text>
        </Pressable>
      </View>
    </View>
  )
}
