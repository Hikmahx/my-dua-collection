import { BottomSheet } from '@/components/ui/bottom-sheet'
import { GoldButton } from '@/components/ui/gold-button'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useT } from '@/hooks/use-t'
import tw from '@/lib/tailwind'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { useEffect, useState } from 'react'
import { Platform, Text, View } from 'react-native'

interface TimePickerSheetProps {
  visible: boolean
  value: { hour: number; minute: number }
  onClose: () => void
  onConfirm: (time: { hour: number; minute: number }) => void
}

const toDate = ({ hour, minute }: { hour: number; minute: number }) => new Date(2000, 0, 1, hour, minute)

/**
 * Picks a time of day. iOS shows a bottom sheet with the spinner and a Done button; Android opens the system's own
 * time dialog (there is nothing to draw, so this renders nothing there).
 */
export function TimePickerSheet({ visible, value, onClose, onConfirm }: TimePickerSheetProps) {
  const c = useSettingsColors()
  const t = useT()
  const isDark = useColorScheme() === 'dark'
  const [draft, setDraft] = useState(toDate(value))

  // each time it opens, start from the saved time
  useEffect(() => {
    if (visible) setDraft(toDate(value))
  }, [visible, value])

  // Android: open the system dialog
  useEffect(() => {
    if (Platform.OS !== 'android' || !visible) return
    DateTimePickerAndroid.open({
      value: toDate(value),
      mode: 'time',
      onChange: (event, selected) => {
        if (event.type === 'set' && selected) onConfirm({ hour: selected.getHours(), minute: selected.getMinutes() })
        onClose()
      },
    })
    // opened once each time `visible` turns on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  if (Platform.OS === 'android') return null

  return (
    <BottomSheet visible={visible} onClose={onClose} backgroundColor={c.card} handleColor={c.divider}>
      <View style={tw`px-[24px] pb-[24px]`}>
        <Text style={[tw`font-nunito-bold text-[17px] text-center`, { color: c.title }]}>{t('timePicker.title')}</Text>
        <DateTimePicker
          value={draft}
          mode='time'
          display='spinner'
          themeVariant={isDark ? 'dark' : 'light'}
          onChange={(_, selected) => selected && setDraft(selected)}
          style={tw`self-center`}
        />
        <GoldButton
          label={t('common.done')}
          onPress={() => {
            onConfirm({ hour: draft.getHours(), minute: draft.getMinutes() })
            onClose()
          }}
        />
      </View>
    </BottomSheet>
  )
}
