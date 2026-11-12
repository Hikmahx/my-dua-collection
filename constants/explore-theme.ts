/**
 * Explore screen colours for both modes. Everything that changes between light and
 * dark lives here, so restyling the screen is a one-file job.
 */
export const exploreTheme = {
  dark: {
    title: '#FFFFFF',
    label: '#FFFFFF',
    icon: '#C9AD65', // gold
    iconBox: 'rgba(26, 90, 102, 0.55)', // rounded square behind each icon
    // 3x3 cells alternate: #043340 @ 50%  /  #063743 @ 70%
    cellA: 'rgba(4, 51, 64, 0.5)',
    cellB: 'rgba(6, 55, 67, 0.7)',
    gridLine: 'rgba(26, 90, 102, 0.55)',
    searchBand: 'transparent', // strip behind the search bar
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
    icon: '#C9AD65', // gold icon on a solid emerald box
    iconBox: '#066653',
    cellA: 'rgba(255, 255, 255, 0.5)', // frosts the pattern behind
    cellB: 'rgba(255, 255, 255, 0.5)',
    gridLine: '#E7E9E7',
    searchBand: '#EDEDED',
    searchBg: '#F6F7F6',
    searchBorder: '#E8EAE8',
    searchIcon: '#C2A462',
    searchText: '#1A1A1A',
    searchPlaceholder: '#8A8A8A',
    filterIcon: '#11181C',
  },
} as const
