import { useAddDuaColors } from '@/hooks/use-add-dua-colors'
import { useT } from '@/hooks/use-t'
import type { DraftOrigin } from '@/lib/dua-draft'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import { Text, View } from 'react-native'

/** Top of the form when it was filled in from a picture or by the AI: says so, and asks the user to check it. */
export function AutofillBanner({ origin }: { origin: DraftOrigin }) {
  const c = useAddDuaColors()
  const t = useT()

  return (
    <View
      style={[
        tw`flex-row items-start p-3 mb-5 rounded-lg border ${c.border}`,
        { borderLeftWidth: 3, borderLeftColor: '#C2A462', backgroundColor: c.isDark ? 'rgba(194,164,98,0.08)' : 'rgba(194,164,98,0.1)' },
      ]}
    >
      <Feather name={origin === 'ai' ? 'cpu' : 'image'} size={16} color='#C2A462' style={tw`mt-0.5 mr-2`} />
      <Text style={tw`flex-1 text-sm ${c.text}`}>{t(origin === 'ai' ? 'addDua.autofill.ai' : 'addDua.autofill.image')}</Text>
    </View>
  )
}
