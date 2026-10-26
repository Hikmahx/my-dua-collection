import FeaturedBannerHandsIcon from '@/components/icons/FeaturedBannerHandsIcon'
import tw from '@/lib/tailwind'
import React, { useState } from 'react'
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

// Artwork canvas is 315 x 150; the card is 150 tall and as wide as its container.
const ART_RATIO = 315 / 150
const RADIUS = 22

const FeaturedDuaBanner = ({
  title,
  arabicText,
  englishTranslation,
  onPress,
  onMoreInfo,
  verseReference,
}: FeaturedDuaBannerProps) => {
  // The mosque artwork follows the card's HEIGHT (not its width), so it keeps the
  // same size and stays pinned bottom-right on phones and tablets alike.
  const [height, setHeight] = useState(150)

  return (
    // Outer view: shadow only (iOS drops shadows on views that clip their children)
    <View
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
      style={[
        tw`w-full bg-dark-emerald`,
        {
          minHeight: 150,
          borderRadius: RADIUS,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 14,
          elevation: 5,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          tw`flex-1 overflow-hidden`,
          { borderRadius: RADIUS, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <BannerGradient style={StyleSheet.absoluteFill} />
        <View
          pointerEvents='none'
          style={[
            tw`absolute right-0 top-0`,
            { height, width: height * ART_RATIO },
          ]}
        >
          <BannerBackground style={StyleSheet.absoluteFill} />
        </View>

        <View
          style={{
            width: 200,
            maxWidth: '66%', // keep text clear of the mosque on narrow phones
            paddingLeft: 17,
            paddingTop: 21,
            paddingBottom: 14,
          }}
        >
          <View style={tw`flex-row items-center gap-2 mb-2.5`}>
            <FeaturedBannerHandsIcon size={20} color='white' />
            <Text style={tw`text-white font-nunito text-[14px]`}>{title}</Text>
          </View>

          <Text style={[tw`text-white text-[15px]`, { lineHeight: 20, textAlign: 'left' }]}>
            {arabicText}
          </Text>
          <Text
            style={[
              tw`text-white font-nunito opacity-90 text-[10px] mt-0.5`,
              { lineHeight: 14 },
            ]}
          >
            {englishTranslation}
          </Text>
          {verseReference ? (
            <Text style={tw`text-white font-berkshire opacity-90 text-[7px] mt-1`}>
              {verseReference}
            </Text>
          ) : null}

          {onMoreInfo && (
            <Pressable
              onPress={onMoreInfo}
              style={tw`rounded-full px-4 py-2 self-start mt-3 bg-white/20`}
            >
              <Text style={tw`text-white text-xs font-nunito-semibold`}>More info</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </View>
  )
}

export { FeaturedDuaBanner }
