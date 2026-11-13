import { CollectionIcon, lineIconNativeSize, type LineIconKey } from '@/components/icons/collection-icons'
import { exploreTheme } from '@/constants/explore-theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import { Pressable, Text, View } from 'react-native'

export interface ExploreCardProps {
  label?: string
  iconKey?: LineIconKey
  /** Position in the grid (0-based). Even / odd cells get the two alternating shades. */
  index: number
  columns: number
  isLastRow: boolean
  onPress?: () => void
}

/**
 * One cell of the Explore grid. It fills its row (flex: 1), so the grid stretches to the
 * available height. With no label/icon it renders an empty (but styled) cell.
 */
export function ExploreCard({
  label,
  iconKey,
  index,
  columns,
  isLastRow,
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
        flex: 1,
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
            {/* size = the icon's designed size, so every icon looks like it does in Figma */}
            <CollectionIcon name={iconKey} color={c.icon} size={lineIconNativeSize(iconKey)} />
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
