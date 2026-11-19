import { AvatarEditor } from '@/components/profile/avatar-editor'
import { AccountCard } from '@/components/profile/account-card'
import { ProfileField } from '@/components/profile/profile-field'
import { SignInOptions } from '@/components/profile/sign-in-options'
import { UserCodeCard } from '@/components/profile/user-code-card'
import { SettingsGroup } from '@/components/settings/settings-group'
import { SettingsRow } from '@/components/settings/settings-row'
import { BackButton } from '@/components/ui/back-button'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { GoldButton } from '@/components/ui/gold-button'
import { ScreenHeader } from '@/components/ui/screen-header'
import { useProfile } from '@/hooks/use-profile'
import { useSettingsColors } from '@/hooks/use-settings-colors'
import { useUserActions } from '@/hooks/use-user-actions'
import {
  cleanName,
  draftFromProfile,
  hasErrors,
  isDraftChanged,
  isEmailEditable,
  validateDraft,
  type Profile,
  type ProfileDraft,
} from '@/lib/profile-utils'
import tw from '@/lib/tailwind'
import { useNavigation, useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Confirm = 'discard' | 'signOut' | 'resetCode' | null

/**
 * Profile details: the avatar editor (male / female and the colors), the name, the connected
 * account and the user code. Not signed in, the account block offers to sign in, and the name and
 * avatar are saved on this device only.
 */
export default function ProfileScreen() {
  const profile = useProfile()
  // start with a fresh form whenever who is shown changes (sign in or out)
  return <ProfileEditor key={profile.userId ?? 'guest'} profile={profile} />
}

function ProfileEditor({ profile }: { profile: Profile }) {
  const c = useSettingsColors()
  const router = useRouter()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const actions = useUserActions()

  const saved = useMemo(() => draftFromProfile(profile), [profile])
  const [draft, setDraft] = useState<ProfileDraft>(saved)
  const [confirm, setConfirm] = useState<Confirm>(null)

  const emailEditable = isEmailEditable(profile)
  const errors = validateDraft(draft, emailEditable)
  const changed = isDraftChanged(draft, saved)
  const change = (patch: Partial<ProfileDraft>) => setDraft((current) => ({ ...current, ...patch }))

  // Leaving with unsaved changes (back arrow, swipe or the Android back button) asks first
  const pendingLeave = useRef<Parameters<typeof navigation.dispatch>[0] | null>(null)
  const allowLeave = useRef(false)
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event) => {
        if (allowLeave.current || !changed) return
        event.preventDefault()
        pendingLeave.current = event.data.action
        setConfirm('discard')
      }),
    [navigation, changed],
  )

  const save = () => {
    if (!changed || hasErrors(errors)) return
    actions.saveProfile({
      firstName: cleanName(draft.firstName),
      lastName: cleanName(draft.lastName) || undefined,
      email: emailEditable ? draft.email.trim() : undefined,
      avatar: draft.avatar,
    })
    allowLeave.current = true
    router.back()
  }

  const discard = () => {
    allowLeave.current = true
    setConfirm(null)
    if (pendingLeave.current) navigation.dispatch(pendingLeave.current)
    else router.back()
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: c.body }}
    >
      <ScreenHeader
        title='Profile details'
        bottomPadding={14}
        left={<BackButton onPress={() => router.back()} color={c.title} />}
        right={null}
      />

      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={tw`pt-4 pb-6`}>
        <SettingsGroup title='Avatar'>
          <AvatarEditor value={draft.avatar} onChange={(avatar) => change({ avatar })} />
        </SettingsGroup>

        <SettingsGroup title='Details'>
          <View style={tw`pb-4`}>
            <ProfileField
              label='First name'
              value={draft.firstName}
              onChangeText={(firstName) => change({ firstName })}
              error={errors.firstName}
              autoComplete='given-name'
            />
            <ProfileField
              label='Last name (optional)'
              value={draft.lastName}
              onChangeText={(lastName) => change({ lastName })}
              error={errors.lastName}
              autoComplete='family-name'
            />
            {profile.isSignedIn && (
              <ProfileField
                label='Email'
                value={draft.email}
                onChangeText={(email) => change({ email })}
                editable={emailEditable}
                error={errors.email}
                helper={
                  emailEditable
                    ? `${profile.providerLabel} did not share an email. Adding one is optional.`
                    : `From your ${profile.providerLabel} account`
                }
                placeholder='name@example.com'
                keyboardType='email-address'
                autoCapitalize='none'
                autoComplete='email'
              />
            )}
          </View>
        </SettingsGroup>

        <SettingsGroup title='Account'>
          {profile.isSignedIn && profile.provider ? (
            [
              <AccountCard key='account' provider={profile.provider} email={profile.email} />,
              <UserCodeCard key='code' code={profile.userCode ?? ''} onReset={() => setConfirm('resetCode')} />,
              <SettingsRow
                key='signout'
                icon='logout'
                title='Sign out'
                destructive
                chevron={false}
                onPress={() => setConfirm('signOut')}
              />,
            ]
          ) : (
            <View style={tw`py-4`}>
              <Text style={[tw`font-nunito-semibold text-[14px]`, { color: c.title }]}>You are not signed in</Text>
              <Text style={[tw`font-nunito text-[12px] leading-[18px] mt-1 mb-4`, { color: c.muted }]}>
                Sign in to save your collections online and share duas with friends. Until then, your name and
                avatar are saved on this device only.
              </Text>
              <SignInOptions onSignIn={actions.signIn} />
            </View>
          )}
        </SettingsGroup>
      </ScrollView>

      <View style={[tw`px-6 pt-3`, { backgroundColor: c.header, paddingBottom: insets.bottom + 12 }]}>
        <GoldButton label='Save changes' onPress={save} disabled={!changed || hasErrors(errors)} />
      </View>

      <ConfirmModal
        visible={confirm === 'discard'}
        title='Discard changes?'
        message='You have changes that are not saved.'
        confirmLabel='Discard'
        cancelLabel='Keep editing'
        onConfirm={discard}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmModal
        visible={confirm === 'signOut'}
        title='Sign out?'
        message='You can sign in again at any time.'
        confirmLabel='Sign out'
        onConfirm={() => {
          setConfirm(null)
          actions.signOut()
        }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmModal
        visible={confirm === 'resetCode'}
        title='Reset your user code?'
        message='Your current code stops working right away. Your friends and shares are not affected.'
        confirmLabel='Reset code'
        onConfirm={() => {
          setConfirm(null)
          actions.resetUserCode()
        }}
        onCancel={() => setConfirm(null)}
      />
    </KeyboardAvoidingView>
  )
}
