import { useColorScheme } from '@/hooks/use-color-scheme'

/** The look of the add-dua form in the current mode: Tailwind classes for text, inputs and borders, and the hex colors the classes cannot give. */
export function useAddDuaColors() {
  const isDark = useColorScheme() === 'dark'
  return {
    isDark,
    text: isDark ? 'text-light-grayish-text' : 'text-dark-text',
    muted: isDark ? 'text-light-grayish-text-muted' : 'text-dark-grayish-text',
    inputBg: isDark ? 'bg-very-dark-nav-bg' : 'bg-very-light-grayish-bg',
    border: isDark ? 'border-dark-grayish-border' : 'border-very-light-grayish-border',
    placeholder: isDark ? '#A0A0A0' : '#666666',
    icon: isDark ? '#F3F3F3' : '#1A1A1A',
  }
}
