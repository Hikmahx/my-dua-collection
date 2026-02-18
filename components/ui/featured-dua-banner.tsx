import { Pressable, Text, View } from 'react-native'

interface FeaturedDuaBannerProps {
  title: string
  arabicText: string
  englishTranslation: string
  onPress?: () => void
  onMoreInfo?: () => void
}

export function FeaturedDuaBanner({
  title,
  arabicText,
  englishTranslation,
  onPress,
  onMoreInfo,
}: FeaturedDuaBannerProps) {
  return (
    <Pressable
      onPress={onPress}
      className='bg-gradient-to-r from-dark-emerald to-soft-emerald rounded-3xl p-6 mb-6'
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
    >
      <View className='flex-row items-start justify-between'>
        <View className='flex-1'>
          <Text className='text-light-grayish-text font-semibold text-base mb-3'>
            🕌 {title}
          </Text>
          <Text className='text-light-grayish-text text-base font-berkshire mb-3 leading-relaxed'>
            {arabicText}
          </Text>
          <Text className='text-light-grayish-text-muted text-xs leading-relaxed mb-4'>
            {englishTranslation}
          </Text>
          <Pressable
            onPress={onMoreInfo}
            className='bg-soft-emerald/20 rounded-full px-4 py-2 self-start'
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
