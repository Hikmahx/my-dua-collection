/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary emerald colors (green) - used in gradients
        'dark-emerald': '#066653', // Rich, dark emerald
        'soft-emerald': '#27A88D', // Soft, light emerald

        // Secondary gold colors - used in gradients
        'dark-gold': '#C0A25E', // Rich, dark gold
        'soft-gold': '#E4D0A4', // Soft, light gold

        // Accent colors
        'bright-gold': '#C2A462', // Gold accent (icons, highlights)

        // Background colors
        'light-bg': '#FFFFFF', // Light mode background
        'very-dark-bg': '#013241', // Dark mode background (very dark teal)
        'very-light-grayish-bg': '#F9F9F9', // Light mode card/secondary bg
        'very-dark-nav-bg': '#00242F', // Dark mode tab/nav background
        'deep-bg': '#002230', // Dark mode screen background (behind the cards)
        'pill-bg': '#F7F8F8', // Light mode tab-selector container
        'tab-navy': '#14142B', // Light mode inactive tab icon/label

        // Text colors
        'dark-text': '#1A1A1A', // Light mode primary text (very dark)
        'light-grayish-text': '#ECEDEE', // Dark mode primary text (light)
        'dark-grayish-text': '#666666', // Light mode secondary text (medium gray)
        'light-grayish-text-muted': '#A0A0A0', // Dark mode secondary text (light gray)

        // Border & divider colors
        'very-light-grayish-border': '#E0E0E0', // Light mode border (very light gray)
        'dark-grayish-border': '#1A5A66', // Dark mode border (dark teal)
      },

      fontFamily: {
        // One family per class: React Native can't pick a weight from a family list
        berkshire: ['BerkshireSwash_400Regular'],
        nunito: ['NunitoSans_400Regular'],
        'nunito-semibold': ['NunitoSans_600SemiBold'],
        'nunito-bold': ['NunitoSans_700Bold'],
        'nunito-extrabold': ['NunitoSans_800ExtraBold'],
      },

      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '18px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
      },
    },
  },
  plugins: [],
}
