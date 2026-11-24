import { useAddDuaColors } from '@/hooks/use-add-dua-colors'
import { useT } from '@/hooks/use-t'
import { DraftError, scanDuaImage, type DuaDraft } from '@/lib/dua-draft'
import { pickDuaImage } from '@/lib/pick-dua-image'
import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from 'react-native'

type Phase = 'choose' | 'scanning' | 'error'

interface ImageDuaStepProps {
  /** Language of the translation to ask for (the one chosen in Settings). */
  language: string
  /** The text was read: the form is filled in with it. */
  onDraft: (draft: DuaDraft) => void
}

/** One way to get the picture: a gold ringed icon, a title and a line under it (the look of the method rows). */
function PickRow({ icon, title, description, onPress }: { icon: 'camera' | 'image'; title: string; description: string; onPress: () => void }) {
  const c = useAddDuaColors()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      style={({ pressed }) => [tw`flex-row items-center py-4 px-1`, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={tw`w-12 h-12 rounded-full border-2 border-bright-gold items-center justify-center mr-4`}>
        <Feather name={icon} size={22} color='#C2A462' />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`font-semibold text-base ${c.text}`}>{title}</Text>
        <Text style={tw`text-sm mt-0.5 ${c.muted}`}>{description}</Text>
      </View>
    </Pressable>
  )
}

/**
 * "Upload Image": choose between the camera (its viewfinder) and the photo library, wait while the text is read,
 * then hand the result to the form as a draft. If the text cannot be read, the user can retry or pick another picture.
 */
export function ImageDuaStep({ language, onDraft }: ImageDuaStepProps) {
  const c = useAddDuaColors()
  const t = useT()
  const [phase, setPhase] = useState<Phase>('choose')
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  // Each scan has a number; a result from a scan that was cancelled (or a screen that was left) is ignored
  const scanId = useRef(0)

  useEffect(
    () => () => {
      scanId.current += 1
    },
    [],
  )

  const scan = useCallback(
    async (uri: string) => {
      const id = ++scanId.current
      setImageUri(uri)
      setPhase('scanning')
      try {
        const draft = await scanDuaImage(uri, language)
        if (id === scanId.current) onDraft(draft)
      } catch (error) {
        if (id !== scanId.current) return
        console.warn(error)
        setMessage(error instanceof DraftError && error.code === 'no-text' ? t('addDua.image.noText') : t('addDua.image.errorBody'))
        setPhase('error')
      }
    },
    [language, onDraft, t],
  )

  const choose = async (from: 'camera' | 'library') => {
    try {
      const picked = await pickDuaImage(from)
      if (picked.status === 'denied') {
        Alert.alert(t('addDua.image.permissionTitle'), t('addDua.image.cameraDenied'))
      } else if (picked.status === 'picked') {
        scan(picked.uri)
      }
    } catch (error) {
      // e.g. a simulator without a camera
      console.warn(error)
      Alert.alert(t('addDua.image.errorTitle'), from === 'camera' ? t('addDua.image.cameraUnavailable') : t('addDua.image.errorBody'))
    }
  }

  const cancelScan = () => {
    scanId.current += 1
    setPhase('choose')
  }

  if (phase === 'choose') {
    return (
      <View>
        <Text style={tw`text-sm ${c.muted} mb-2`}>{t('addDua.image.intro')}</Text>
        <PickRow icon='camera' title={t('addDua.image.camera')} description={t('addDua.image.cameraDesc')} onPress={() => choose('camera')} />
        <PickRow icon='image' title={t('addDua.image.gallery')} description={t('addDua.image.galleryDesc')} onPress={() => choose('library')} />
        <Text style={tw`text-xs ${c.muted} mt-3`}>{t('addDua.image.tip')}</Text>
      </View>
    )
  }

  return (
    <View>
      {/* The picture, with the progress over it while the text is read */}
      <View style={tw`h-56 rounded-xl overflow-hidden border ${c.border} ${c.inputBg}`}>
        {imageUri && <Image source={{ uri: imageUri }} resizeMode='contain' style={tw`w-full h-full`} />}
        {phase === 'scanning' && (
          <View
            style={[tw`absolute inset-0 items-center justify-center`, { backgroundColor: 'rgba(0,33,46,0.72)' }]}
            accessibilityLiveRegion='polite'
          >
            <ActivityIndicator size='large' color='#C2A462' />
            <Text style={tw`mt-3 font-semibold text-light-grayish-text`}>{t('addDua.image.scanning')}</Text>
            <Text style={tw`mt-1 text-xs text-light-grayish-text-muted`}>{t('addDua.image.scanningHint')}</Text>
          </View>
        )}
      </View>

      {phase === 'scanning' ? (
        <Pressable onPress={cancelScan} style={tw`items-center py-4`} accessibilityRole='button'>
          <Text style={tw`font-semibold ${c.text}`}>{t('common.cancel')}</Text>
        </Pressable>
      ) : (
        <View style={tw`mt-4`}>
          <Text style={tw`font-semibold ${c.text} mb-1`}>{t('addDua.image.errorTitle')}</Text>
          <Text style={tw`text-sm ${c.muted} mb-4`}>{message}</Text>
          <View style={tw`flex-row gap-3`}>
            <Pressable
              onPress={() => setPhase('choose')}
              style={({ pressed }) => [tw`flex-1 px-4 py-3 rounded-lg border ${c.inputBg} ${c.border}`, { opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={tw`text-center font-semibold ${c.text}`}>{t('addDua.image.chooseAnother')}</Text>
            </Pressable>
            <Pressable
              onPress={() => imageUri && scan(imageUri)}
              style={({ pressed }) => [tw`flex-1 px-4 py-3 rounded-lg bg-dark-emerald`, { opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={tw`text-center font-semibold text-light-grayish-text`}>{t('addDua.image.tryAgain')}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  )
}
