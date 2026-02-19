import { Pressable, Text, View } from 'react-native'
import { BannerBackground } from './banner-background'

interface FeaturedDuaBannerProps {
  title: string
  arabicText: string
  englishTranslation: string
  onPress?: () => void
  onMoreInfo?: () => void
  verseReference?: string
}

export function FeaturedDuaBanner({
  title,
  arabicText,
  englishTranslation,
  onPress,
  onMoreInfo,
  verseReference,
}: FeaturedDuaBannerProps) {
  return (
    <Pressable
      onPress={onPress}
      className='rounded-3xl p-6 mb-6 overflow-hidden'
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
    >
      {/* Background SVG */}
      <View className='absolute inset-0'>
        <BannerBackground style={{ width: '100%', height: '100%' }} />
      </View>

      {/* Content */}
      <View className='flex-row items-start justify-between relative z-10'>
        <View className='flex-1 pr-8'>
          <Text className='text-light-grayish-text font-semibold text-base mb-3'>
            🕌 {title}
          </Text>
          <Text className='text-light-grayish-text text-base font-berkshire mb-3 leading-relaxed'>
            {arabicText}
          </Text>
          <Text className='text-light-grayish-text-muted text-xs leading-relaxed mb-4'>
            {englishTranslation}
          </Text>
          {verseReference && (
            <Text className='text-light-grayish-text-muted text-xs mb-3'>
              {verseReference}
            </Text>
          )}
          <Pressable
            onPress={onMoreInfo}
            className='bg-light-grayish-text/20 rounded-full px-4 py-2 self-start'
          >
            <Text className='text-light-grayish-text text-xs font-semibold'>
              Open in life
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}
