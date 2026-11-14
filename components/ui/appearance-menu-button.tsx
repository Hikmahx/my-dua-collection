import { FilterMenu } from '@/components/ui/filter-menu'
import { themeColors } from '@/constants/theme-colors'
import { useColorScheme } from '@/hooks/use-color-scheme'
import type { FilterMenuAnchor, FilterMenuSection } from '@/lib/types'
import { setTheme } from '@/redux/reducers/settingsSlice'
import type { RootState } from '@/redux/store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useCallback, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The header "tune" icon with its Appearance (Dark / Light) dropdown.
 * Used in every screen header, so the menu logic lives here once.
 */
export function AppearanceMenuButton() {
  const isDark = useColorScheme() === 'dark'
  const dispatch = useDispatch()
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

  // Add new sections here as more options arrive
  const sections: FilterMenuSection[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      options: [
        {
          id: 'dark',
          label: 'Dark',
          icon: 'weather-night',
          selected: theme === 'dark',
          onSelect: () => dispatch(setTheme('dark')),
        },
        {
          id: 'light',
          label: 'Light',
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
        accessibilityLabel='Appearance'
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        onPress={openMenu}
      >
        <MaterialCommunityIcons
          name='tune-variant'
          size={26}
          color={isDark ? themeColors.lightGrayishText : themeColors.darkText}
        />
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
