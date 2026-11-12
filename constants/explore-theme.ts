/**
 * Explore screen colours for both modes. Everything that changes between light and
 * dark lives here, so restyling the screen is a one-file job.
 */
export const exploreTheme = {
  dark: {
    title: '#FFFFFF',
    label: '#FFFFFF',
    icon: '#C9AD65', // gold, same as the exported SVGs
    iconBox: 'rgba(26, 90, 102, 0.55)', // rounded square behind each icon
    // 3x3 cells alternate: #043340 @ 50%  /  #063743 @ 70%
    cellA: 'rgba(4, 51, 64, 0.5)',
    cellB: 'rgba(6, 55, 67, 0.7)',
    gridLine: 'rgba(26, 90, 102, 0.55)',
    searchBg: 'rgba(255, 255, 255, 0.05)',
    searchBorder: '#1A5A66',
    searchIcon: '#C9AD65',
    searchText: '#FFFFFF',
    searchPlaceholder: '#7F9CA3',
    filterIcon: '#FFFFFF',
  },
  light: {
    title: '#1A1A1A',
    label: '#1A1A1A',
    icon: '#066653', // dark emerald (same as the active tab in light mode)
    iconBox: 'rgba(6, 102, 83, 0.1)',
    cellA: 'rgba(6, 102, 83, 0.04)',
    cellB: 'rgba(6, 102, 83, 0.09)',
    gridLine: 'rgba(6, 102, 83, 0.15)',
    searchBg: '#F7F8F8',
    searchBorder: '#E0E0E0',
    searchIcon: '#066653',
    searchText: '#1A1A1A',
    searchPlaceholder: '#8A9A97',
    filterIcon: '#11181C',
  },
} as const
