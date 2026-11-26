import { PrayerBeadsLogo } from '@/components/icons/prayer-beads-logo'
import { ShareCardBackground } from '@/components/share/share-card-background'
import { ArabicText } from '@/components/ui/arabic-text'
import { SHARE_APP_NAME } from '@/constants/share-config'
import type { CardTheme } from '@/constants/share-theme'
import { withAlpha } from '@/constants/theme-colors'
import { cardMinHeight, cardUnit, getCardTextScale, type CardContent } from '@/lib/share/card-layout'
import tw from '@/lib/tailwind'
import { useState, type RefObject } from 'react'
import { Text, View } from 'react-native'
import Svg, { Polygon } from 'react-native-svg'

interface ShareCardProps {
  content: CardContent
  theme: CardTheme
  /** Width in px. Everything on the card scales with it. */
  width: number
  /** Corner radius in design px (the card is drawn at 360 wide). 0 for the picture that is saved, a few for the preview. */
  radius?: number
  /** For taking the picture (see lib/share/capture-card.ts). */
  viewRef?: RefObject<View | null>
  onSize?: (size: { width: number; height: number }) => void
}

/** A small eight-pointed star with a line on each side: the divider under the title. */
function OrnamentDivider({ color, u }: { color: string; u: (size: number) => number }) {
  const size = u(14)
  const points = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? 10 : 5
    const a = (Math.PI / 8) * i - Math.PI / 2
    return `${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch' }}>
      <View style={{ flex: 1, height: 1, backgroundColor: withAlpha(color, 0.55) }} />
      <Svg width={size} height={size} viewBox='0 0 24 24' style={{ marginHorizontal: u(10) }}>
        <Polygon points={points} fill={color} />
      </Svg>
      <View style={{ flex: 1, height: 1, backgroundColor: withAlpha(color, 0.55) }} />
    </View>
  )
}

/**
 * The picture a dua is shared as: title, the Arabic, transliteration and translation, the source,
 * and the app's watermark at the bottom. It is at least 4:5 and grows taller for a long dua (whose
 * text is also set a little smaller). The same component draws the preview and the saved picture.
 */
export function ShareCard({ content, theme, width, radius = 0, viewRef, onSize }: ShareCardProps) {
  const u = cardUnit(width)
  const scale = getCardTextScale(content)
  const [height, setHeight] = useState(cardMinHeight(width))

  return (
    <View
      ref={viewRef}
      collapsable={false} // Android would otherwise drop this view and there would be nothing to take a picture of
      onLayout={({ nativeEvent }) => {
        setHeight(nativeEvent.layout.height)
        onSize?.({ width: nativeEvent.layout.width, height: nativeEvent.layout.height })
      }}
      style={{
        width,
        minHeight: cardMinHeight(width),
        borderRadius: u(radius),
        overflow: 'hidden',
        backgroundColor: theme.from,
      }}
    >
      <ShareCardBackground theme={theme} width={width} height={height} />

      {/* the thin frame */}
      <View
        pointerEvents='none'
        style={{
          position: 'absolute',
          top: u(12),
          left: u(12),
          right: u(12),
          bottom: u(12),
          borderRadius: u(16),
          borderWidth: 1,
          borderColor: withAlpha(theme.accent, 0.5),
        }}
      />

      <View style={{ flexGrow: 1, paddingHorizontal: u(32), paddingTop: u(40), paddingBottom: u(30) }}>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={[
              tw`font-nunito-bold text-center uppercase`,
              { color: theme.title, fontSize: u(11), letterSpacing: u(2.2), marginBottom: u(12) },
            ]}
          >
            {content.title}
          </Text>
          <OrnamentDivider color={theme.accent} u={u} />
        </View>

        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: u(22) }}>
          <ArabicText size={u(28) * scale} color={theme.arabic} style={{ textAlign: 'center' }}>
            {content.arabic}
          </ArabicText>

          {content.transliteration ? (
            <Text
              style={[
                tw`font-nunito text-center`,
                {
                  color: theme.transliteration,
                  fontSize: u(13) * scale,
                  lineHeight: u(13) * scale * 1.5,
                  marginTop: u(18),
                  fontStyle: 'italic',
                },
              ]}
            >
              {content.transliteration}
            </Text>
          ) : null}

          {content.translation ? (
            <Text
              style={[
                tw`font-nunito text-center`,
                {
                  color: theme.translation,
                  fontSize: u(14.5) * scale,
                  lineHeight: u(14.5) * scale * 1.5,
                  marginTop: u(16),
                },
              ]}
            >
              {content.translation}
            </Text>
          ) : null}

          {content.reference ? (
            <View
              style={{
                marginTop: u(20),
                paddingHorizontal: u(14),
                paddingVertical: u(6),
                borderRadius: u(20),
                backgroundColor: theme.pillBg,
              }}
            >
              <Text style={[tw`font-nunito-semibold`, { color: theme.pillText, fontSize: u(11.5) }]}>
                {content.reference}
              </Text>
            </View>
          ) : null}
        </View>

        {/* the watermark */}
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PrayerBeadsLogo size={u(20)} color={theme.watermark} />
            <Text style={[tw`font-berkshire`, { color: theme.watermark, fontSize: u(14), marginLeft: u(8) }]}>
              {SHARE_APP_NAME}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
