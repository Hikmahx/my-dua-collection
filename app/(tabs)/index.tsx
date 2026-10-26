import { CollectionCard } from '@/components/ui/collection-card'
import { FeaturedDuaBanner } from '@/components/ui/featured-dua-banner'
import { TabSelector } from '@/components/ui/tab-selector'
import { COLLECTION_DEFS } from '@/constants/collections'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { RootState } from '@/redux/store'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

const SIDE_MARGIN = 30
const GRID_GAP = 10

export default function HomeScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const router = useRouter()
  const { width } = useWindowDimensions()

  // Responsive grid: 2 columns on phones, 3 on large phones/small tablets, 4 on big tablets.
  // Content is capped and centred so it doesn't stretch edge-to-edge on tablets.
  const columns = width >= 900 ? 4 : width >= 600 ? 3 : 2
  const contentWidth = Math.min(width, 840) - SIDE_MARGIN * 2
  const cardWidth = Math.floor((contentWidth - GRID_GAP * (columns - 1)) / columns)

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

  const textColor = isDark ? 'text-white' : 'text-dark-text'

  return (
    <SafeAreaView
      edges={['top']}
      style={tw`flex-1 ${isDark ? 'bg-deep-bg' : 'bg-light-bg'}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, alignItems: 'center' }}
      >
        <View style={{ width: contentWidth }}>
          {/* Header */}
          <View style={tw`flex-row items-center justify-between min-h-[30px] mb-[30px]`}>
            <Text style={tw`font-nunito-extrabold text-[21px] ${textColor}`}>
              Home
            </Text>
            <Pressable
              hitSlop={12}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              onPress={() => {}}
            >
              <MaterialCommunityIcons
                name='tune-variant'
                size={26}
                color={isDark ? '#FFFFFF' : '#11181C'}
              />
            </Pressable>
          </View>

          {/* Featured banner */}
          <FeaturedDuaBanner
            title='Quranic Dua'
            arabicText='لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَٰنَكَ إِنِّي كُنتُ مِنَ ٱلظَّٰلِمِينَ'
            englishTranslation='There is no deity but You. Indeed, I have been of the wrongdoers.'
            verseReference='Quran 21:87'
          />

          {/* Dua Collection section */}
          <View style={tw`flex-row items-center justify-between mt-[34px] mb-[30px]`}>
            <Text style={tw`font-nunito text-[14px] ${textColor}`}>
              Dua Collection
            </Text>
            <TabSelector
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </View>

          {/* Collections grid (2 columns, 10pt gap) */}
          <View style={[tw`flex-row flex-wrap`, { gap: GRID_GAP }]}>
            {filteredCollections().length > 0 ? (
              filteredCollections().map((col) => (
                <View key={col.id} style={{ width: cardWidth }}>
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
                  style={tw`text-center font-nunito ${isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text'}`}
                >
                  No collections in this category
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <View style={tw`absolute right-[28px] bottom-[24px]`}>
        <Pressable
          onPress={handleAddDua}
          style={({ pressed }) => [
            tw`w-[50px] h-[50px] rounded-full bg-dark-emerald items-center justify-center`,
            {
              opacity: pressed ? 0.8 : 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 6,
            },
          ]}
        >
          <Feather name='plus' size={26} color='#F3F3F3' />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
