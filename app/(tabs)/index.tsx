import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { BerkshireSwash_400Regular } from '@expo-google-fonts/berkshire-swash'
import {
  NunitoSans_400Regular,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans'
import { useFonts } from 'expo-font'
import { ScrollView, Text, View } from 'react-native'

export default function HomeScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const [fontsLoaded] = useFonts({
    BerkshireSwash_400Regular,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  })

  if (!fontsLoaded) {
    return (
      <View
        style={tw`flex-1 items-center justify-center bg-light-bg dark:bg-very-dark-bg`}
      >
        <Text>Loading fonts...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-light-bg dark:bg-very-dark-bg`}
      contentContainerStyle={tw`px-6 py-8`}
    >
      {/* Header with Berkshire Swash */}
      <Text
        style={tw`text-4xl font-berkshire text-dark-emerald mb-6 text-center`}
      >
        My Dua Collection
      </Text>

      {/* Mode Indicator */}
      <Text
        style={tw`text-sm font-nunito text-dark-grayish-text dark:text-light-grayish-text-muted mb-8 text-center`}
      >
        Mode: {isDark ? '🌙 Dark' : '☀️ Light'} (Toggle device settings)
      </Text>

      {/* Primary Gradient Colors */}
      <View style={tw`mb-8`}>
        <Text
          style={tw`text-lg font-nunito font-bold text-dark-text dark:text-light-grayish-text mb-3`}
        >
          Primary Colors (Green)
        </Text>

        <View style={tw`flex-row gap-4 mb-3`}>
          <View
            style={tw`flex-1 h-24 rounded-lg items-center justify-center bg-dark-emerald`}
          >
            <Text style={tw`text-white text-sm font-nunito`}>Emerald Dark</Text>
            <Text style={tw`text-white text-xs opacity-80`}>#066653</Text>
          </View>

          <View
            style={tw`flex-1 h-24 rounded-lg items-center justify-center bg-soft-emerald`}
          >
            <Text style={tw`text-white text-sm font-nunito`}>Emerald Soft</Text>
            <Text style={tw`text-white text-xs opacity-80`}>#27A88D</Text>
          </View>
        </View>
      </View>

      {/* Secondary Gradient Colors */}
      <View style={tw`mb-8`}>
        <Text
          style={tw`text-lg font-nunito font-bold text-dark-text dark:text-light-grayish-text mb-3`}
        >
          Secondary Colors (Gold)
        </Text>

        <View style={tw`flex-row gap-4 mb-3`}>
          <View
            style={tw`flex-1 h-24 rounded-lg items-center justify-center bg-dark-gold`}
          >
            <Text style={tw`text-white text-sm font-nunito`}>Gold Dark</Text>
            <Text style={tw`text-white text-xs opacity-80`}>#C0A25E</Text>
          </View>

          <View
            style={tw`flex-1 h-24 rounded-lg items-center justify-center bg-soft-gold`}
          >
            <Text style={tw`text-dark-text text-sm font-nunito`}>
              Gold Soft
            </Text>
            <Text style={tw`text-dark-text text-xs opacity-80`}>#E4D0A4</Text>
          </View>
        </View>
      </View>

      {/* Accent Color */}
      <View style={tw`mb-8`}>
        <Text
          style={tw`text-lg font-nunito font-bold text-dark-text dark:text-light-grayish-text mb-3`}
        >
          Accent Color (Icons)
        </Text>

        <View
          style={tw`h-24 rounded-lg items-center justify-center bg-bright-gold`}
        >
          <Text style={tw`text-white text-sm font-nunito`}>Gold Accent</Text>
          <Text style={tw`text-white text-xs opacity-80`}>#C2A462</Text>
        </View>
      </View>

      {/* Background & UI Colors */}
      <View style={tw`mb-8`}>
        <Text
          style={tw`text-lg font-nunito font-bold text-dark-text dark:text-light-grayish-text mb-3`}
        >
          UI Colors (Mode-specific)
        </Text>

        <View style={tw`gap-3`}>
          <View
            style={tw`p-4 rounded-lg border border-very-light-grayish-border dark:border-dark-grayish-border bg-very-light-grayish-bg dark:bg-very-dark-bg`}
          >
            <Text
              style={tw`text-dark-text dark:text-light-grayish-text font-nunito font-bold mb-1`}
            >
              Card Background
            </Text>
            <Text
              style={tw`text-dark-text dark:text-light-grayish-text opacity-80 text-xs`}
            >
              {isDark ? '#013241' : '#F9F9F9'}
            </Text>
          </View>

          <View
            style={tw`p-4 rounded-lg border border-very-light-grayish-border dark:border-dark-grayish-border bg-light-bg dark:bg-very-dark-nav-bg`}
          >
            <Text
              style={tw`text-dark-text dark:text-light-grayish-text font-nunito font-bold mb-1`}
            >
              Tab Bar Background
            </Text>
            <Text
              style={tw`text-dark-text dark:text-light-grayish-text opacity-80 text-xs`}
            >
              {isDark ? '#00242F' : '#FFFFFF'}
            </Text>
          </View>
        </View>
      </View>

      {/* Font Demo */}
      <View style={tw`mb-8`}>
        <Text
          style={tw`text-lg font-nunito font-bold text-dark-text dark:text-light-grayish-text mb-3`}
        >
          Fonts
        </Text>

        <View style={tw`gap-4`}>
          <View
            style={tw`p-4 rounded-lg bg-very-light-grayish-bg dark:bg-very-dark-bg`}
          >
            <Text style={tw`text-3xl font-berkshire text-dark-emerald mb-1`}>
              Berkshire Swash
            </Text>
            <Text
              style={tw`text-xs font-nunito text-dark-grayish-text dark:text-light-grayish-text-muted`}
            >
              Elegant, decorative serif font
            </Text>
          </View>

          <View
            style={tw`p-4 rounded-lg bg-very-light-grayish-bg dark:bg-very-dark-bg`}
          >
            <Text
              style={tw`text-lg font-nunito font-bold text-soft-emerald mb-1`}
            >
              Nunito Sans Bold
            </Text>
            <Text
              style={tw`text-sm font-nunito text-dark-grayish-text dark:text-light-grayish-text-muted`}
            >
              Clean, modern sans-serif (Regular & Bold)
            </Text>
          </View>
        </View>
      </View>

      {/* Gradient Preview */}
      <View style={tw`mb-12`}>
        <Text
          style={tw`text-lg font-nunito font-bold text-dark-text dark:text-light-grayish-text mb-3`}
        >
          Gradient Examples
        </Text>

        {/* Primary Gradient */}
        <View
          style={tw`h-32 rounded-lg items-center justify-center mb-4 bg-dark-emerald`}
        >
          <Text style={tw`text-base font-nunito font-bold text-white`}>
            Primary Gradient
          </Text>
          <Text style={tw`text-xs font-nunito text-white opacity-75`}>
            (dark-emerald to soft-emerald)
          </Text>
        </View>

        {/* Secondary Gradient */}
        <View
          style={tw`h-32 rounded-lg items-center justify-center bg-dark-gold`}
        >
          <Text style={tw`text-base font-nunito font-bold text-white`}>
            Secondary Gradient
          </Text>
          <Text style={tw`text-xs font-nunito text-white opacity-75`}>
            (dark-gold to soft-gold)
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
