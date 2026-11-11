import FeaturedBannerHandsIcon from '@/components/icons/FeaturedBannerHandsIcon'
import tw from '@/lib/tailwind'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { BannerBackground } from './banner-background'
import { BannerGradient } from './bannerGradient'

interface FeaturedDuaBannerProps {
  title: string
  arabicText: string
  translation: string
  onPress?: () => void
  onMoreInfo?: () => void
  reference?: string
}

const RADIUS = 22

const FeaturedDuaBanner = ({
  title,
  arabicText,
  translation,
  onPress,
  onMoreInfo,
  reference,
}: FeaturedDuaBannerProps) => {
  // The artwork is sized from the measured card, so it always spans the full width.
  const [size, setSize] = useState({ width: 0, height: 150 })

  return (
    // Outer view: shadow only (iOS drops shadows on views that clip their children)
    <View
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout
        setSize({ width, height })
      }}
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
        <View pointerEvents='none' style={StyleSheet.absoluteFill}>
          {size.width > 0 && (
            <BannerBackground cardWidth={size.width} cardHeight={size.height} />
          )}
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
            {translation}
          </Text>
          {reference ? (
            <Text style={tw`text-white font-berkshire opacity-90 text-[7px] mt-1`}>
              {reference}
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
