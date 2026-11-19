import { Colors } from '@/constants/theme'
import { themeColors as p } from '@/constants/theme-colors'

/**
 * Colors of the Edit collection screen and its delete dialog, sampled from the designs. The
 * header and body come from the shared screen colors.
 */
export const collectionEditTheme = {
  dark: {
    header: Colors.dark.headerSurface,
    body: Colors.dark.screenBackground,
    row: '#083541',
    inputBorder: '#28515A',
    text: '#F3F3F3',
    muted: '#A2B5B8',
    cancel: '#D9BC76',
    minus: '#FFA6A0',
    handle: '#A2B5B8',
    deleteBg: '#3B282D',
    deleteBorder: '#6E3D42',
    deleteText: '#FFA6A0',
    saveBg: '#C9AD65',
    saveText: '#00252F',
    dialog: {
      backdrop: 'rgba(0, 0, 0, 0.2)',
      card: '#083541',
      border: '#28515A',
      title: '#F3F3F3',
      body: '#B8C9CB',
      destructiveBg: '#F29B94',
      destructiveText: '#301819',
      keepBg: '#154650',
      keepText: '#F3F3F3',
    },
    icon: p.lightGrayishText,
  },
  light: {
    header: Colors.light.headerSurface,
    body: Colors.light.screenBody,
    row: '#FFFFFF',
    inputBorder: '#DCE6E2',
    text: '#202322',
    muted: '#626C67',
    cancel: p.darkEmerald,
    minus: '#B83A38',
    handle: '#626C67',
    deleteBg: '#FFF0EE',
    deleteBorder: '#F1D3D0',
    deleteText: '#B83A38',
    saveBg: p.darkEmerald,
    saveText: '#FFFFFF',
    dialog: {
      backdrop: 'rgba(0, 34, 48, 0.42)',
      card: '#FFFFFF',
      border: '#E4EBE8',
      title: '#203E43',
      body: '#5C7075',
      destructiveBg: '#B83A38',
      destructiveText: '#FFFFFF',
      keepBg: '#EDF4F1',
      keepText: p.darkEmerald,
    },
    icon: p.darkText,
  },
} as const
