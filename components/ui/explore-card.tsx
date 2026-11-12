import { ExploreTopicIcon, type ExploreIconKey } from '@/components/icons/explore-topic-icons'
import { exploreTheme } from '@/constants/explore-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { Pressable, Text, View } from 'react-native'

export interface ExploreCardProps {
  label?: string
  iconKey?: ExploreIconKey
  /** Position in the grid (0-based). Even = lighter-transparent shade, odd = the other. */
  index: number
  columns: number
  isLastRow: boolean
  height: number
  onPress?: () => void
}

/** One cell of the Explore grid. With no label/icon it renders an empty (but styled) cell. */
export function ExploreCard({
  label,
  iconKey,
  index,
  columns,
  isLastRow,
  height,
  onPress,
}: ExploreCardProps) {
  const isDark = useColorScheme() === 'dark'
  const c = exploreTheme[isDark ? 'dark' : 'light']
  const isLastCol = index % columns === columns - 1

  return (
    <Pressable
      disabled={!label}
      accessibilityRole='button'
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        width: `${100 / columns}%`,
        height,
        backgroundColor: index % 2 === 0 ? c.cellA : c.cellB,
        borderRightWidth: isLastCol ? 0 : 1,
        borderBottomWidth: isLastRow ? 0 : 1,
        borderColor: c.gridLine,
        opacity: pressed ? 0.7 : 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
      })}
    >
      {label && iconKey ? (
        <>
          <View
            style={[
              tw`w-[56px] h-[56px] rounded-[16px] items-center justify-center mb-[10px]`,
              { backgroundColor: c.iconBox },
            ]}
          >
            <ExploreTopicIcon name={iconKey} color={c.icon} />
          </View>
          {/* fixed 2-line slot so one-line and two-line labels keep the icons aligned */}
          <View style={tw`h-[40px] justify-start`}>
            <Text
              numberOfLines={2}
              style={[
                tw`font-berkshire text-[15px] text-center`,
                { color: c.label, lineHeight: 19 },
              ]}
            >
              {label}
            </Text>
          </View>
        </>
      ) : null}
    </Pressable>
  )
}
