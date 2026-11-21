import { themeColors as p } from '@/constants/theme-colors'

/** Colors of the Ask DuaAI chat in both modes (sampled from the designs). */
export const chatTheme = {
  dark: {
    userBubble: '#022B36',
    userText: p.lightGrayishText,
    aiBubble: '#0B4452',
    aiText: p.lightGrayishText,
    sender: '#D5BD7D',
    dua: '#D5BD7D', // the transliteration line
    muted: '#A2B5B8', // "Today", the source of a dua
    inputBar: '#00242E',
    inputBorder: p.darkGrayishBorder,
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputText: p.lightGrayishText,
    placeholder: '#7F9CA3',
    icon: p.brightGold,
    sendBg: p.brightGold,
    sendIcon: '#013241',
  },
  light: {
    userBubble: p.darkEmerald,
    userText: '#FFFFFF',
    aiBubble: '#FFFFFF',
    aiText: p.darkText,
    sender: p.darkEmerald,
    dua: '#86672A',
    muted: '#6B7A78',
    inputBar: '#F3F3F3',
    inputBorder: p.veryLightGrayishBorder,
    inputBg: '#FFFFFF',
    inputText: p.darkText,
    placeholder: '#6B7A78',
    icon: p.brightGold,
    sendBg: p.darkEmerald,
    sendIcon: p.brightGold,
  },
} as const
