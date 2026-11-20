import { useT } from '@/hooks/use-t'
import { FilterMenu } from '@/components/ui/filter-menu'
import { themeColors } from '@/constants/theme-colors'
import { useColorScheme } from '@/hooks/use-color-scheme'
import tw from '@/lib/tailwind'
import type { FilterMenuAnchor, FilterMenuSection } from '@/lib/types'
import { setTheme } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useCallback, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

interface AppearanceMenuButtonProps {
  /** Extra sections shown above Appearance (e.g. the Surah / Hadith filters). */
  extraSections?: FilterMenuSection[]
  /** Shows a small gold dot on the icon (a filter in the menu is on). */
  active?: boolean
}

/**
 * The header "tune" icon with its Appearance (Dark / Light) dropdown, and optionally more
 * sections above it. Used in every screen header, so the menu logic lives here once.
 */
export function AppearanceMenuButton({
  extraSections = [],
  active = false,
}: AppearanceMenuButtonProps) {
  const isDark = useColorScheme() === 'dark'
  const dispatch = useDispatch()
  const t = useT()
  const theme = useSelector((state: RootState) => state.settings.theme)

  const buttonRef = useRef<View>(null)
  const [anchor, setAnchor] = useState<FilterMenuAnchor | null>(null)
  const [open, setOpen] = useState(false)

  const openMenu = useCallback(() => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
      setOpen(true)
    })
  }, [])

  const sections: FilterMenuSection[] = [
    ...extraSections,
    {
      id: 'appearance',
      title: t('appearance.title'),
      options: [
        {
          id: 'dark',
          label: t('appearance.dark'),
          icon: 'weather-night',
          selected: theme === 'dark',
          onSelect: () => dispatch(setTheme('dark')),
        },
        {
          id: 'light',
          label: t('appearance.light'),
          icon: 'white-balance-sunny',
          selected: theme === 'light',
          onSelect: () => dispatch(setTheme('light')),
        },
      ],
    },
  ]

  return (
    <>
      <Pressable
        ref={buttonRef}
        hitSlop={12}
        accessibilityRole='button'
        accessibilityLabel={extraSections.length > 0 ? t('menu.filtersAndAppearance') : t('appearance.title')}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        onPress={openMenu}
      >
        <View>
          <MaterialCommunityIcons
            name='tune-variant'
            size={26}
            color={isDark ? themeColors.lightGrayishText : themeColors.darkText}
          />
          {active && (
            <View
              style={[
                tw`absolute rounded-full`,
                { top: -1, right: -1, width: 9, height: 9, backgroundColor: themeColors.brightGold },
              ]}
            />
          )}
        </View>
      </Pressable>
      <FilterMenu
        visible={open}
        anchor={anchor}
        sections={sections}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
