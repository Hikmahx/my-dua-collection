import FeaturedBannerHandsIcon from '@/components/icons/FeaturedBannerHandsIcon'
import tw from '@/lib/tailwind'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { BannerBackground } from './banner-background'
import { BannerGradient } from './bannerGradient'

interface FeaturedDuaBannerProps {
  title: string
  arabicText: string
  englishTranslation: string
  onPress?: () => void
  onMoreInfo?: () => void
  verseReference?: string
}

const FeaturedDuaBanner = ({
  title,
  arabicText,
  englishTranslation,
  onPress,
  onMoreInfo,
  verseReference,
}: FeaturedDuaBannerProps) => {
  return (
    <View style={tw`w-full`}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          tw`w-full rounded-3xl p-6 relative overflow-hidden`,
          styles.shadow,
          { opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <BannerGradient style={tw`absolute inset-0 w-full h-full`} />
        <BannerBackground style={tw`absolute inset-0 w-full h-full`} />
        <View style={tw`flex-row items-start justify-between relative z-10`}>
          <View style={tw`flex-1 pr-8`}>
            <View style={tw`flex-row items-center gap-2 mb-3`}>
              <FeaturedBannerHandsIcon size={20} color="white" />
              <Text style={tw`text-white font-semibold text-base`}>{title}</Text>
            </View>
            <Text
              style={[tw`text-base mb-2 leading-relaxed`, { color: '#fff', fontFamily: 'BerkshireSwash_400Regular' }]}
            >
              {arabicText}
            </Text>
            <Text style={tw`text-white text-xs leading-relaxed mb-2 opacity-90`}>{englishTranslation}</Text>
            {verseReference && <Text style={tw`text-white text-xs opacity-80`}>{verseReference}</Text>}
            {onMoreInfo && (
              <Pressable onPress={onMoreInfo} style={tw`rounded-full px-4 py-2 self-start mt-3 bg-white/20`}>
                <Text style={tw`text-white text-xs font-semibold`}>More info</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
})

export { FeaturedDuaBanner }
