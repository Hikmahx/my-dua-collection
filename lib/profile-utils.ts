import type { TFunction } from '@/locales'
import type { AvatarConfig } from '@/constants/avatar-config'
import { getAuthProvider, NAME_MAX_LENGTH } from '@/constants/auth-config'
import type { AuthProvider } from '@/data/types'
import { avatarsEqual } from '@/lib/avatar-utils'
import type { UserState } from '@/redux/reducers/userSlice'

/** Who the app is showing: the signed-in user, or the guest on this device. */
export interface Profile {
  isSignedIn: boolean
  /** The user's id when signed in. */
  userId?: string
  firstName: string
  lastName?: string
  fullName: string
  avatar: AvatarConfig
  email?: string
  provider?: AuthProvider
  /** e.g. 'Google' */
  providerLabel?: string
  /** In stored form, e.g. 'BG7K3M'. Only when signed in. */
  userCode?: string
}

export const fullName = (firstName: string, lastName?: string) => [firstName, lastName].filter(Boolean).join(' ')

export function getProfile({ currentUser, guest }: UserState): Profile {
  if (!currentUser) {
    return {
      isSignedIn: false,
      firstName: guest.firstName,
      lastName: guest.lastName,
      fullName: fullName(guest.firstName, guest.lastName),
      avatar: guest.avatar,
    }
  }
  return {
    isSignedIn: true,
    userId: currentUser.id,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    fullName: fullName(currentUser.firstName, currentUser.lastName),
    avatar: currentUser.avatar,
    email: currentUser.email,
    provider: currentUser.authProvider,
    providerLabel: getAuthProvider(currentUser.authProvider).label,
    userCode: currentUser.userCode,
  }
}

/** What the profile form edits. The inputs are plain text, so every field is a string. */
export interface ProfileDraft {
  firstName: string
  lastName: string
  email: string
  avatar: AvatarConfig
}

export const draftFromProfile = (profile: Profile): ProfileDraft => ({
  firstName: profile.firstName,
  lastName: profile.lastName ?? '',
  email: profile.email ?? '',
  avatar: profile.avatar,
})

/** Trims the ends and turns runs of spaces into one. */
export const cleanName = (value: string) => value.replace(/\s+/g, ' ').trim()

/**
 * The email can only be edited when the user is signed in without one (the provider did not
 * share it). When the provider shared it, it is shown but not changed here.
 */
export const isEmailEditable = (profile: Profile) => profile.isSignedIn && !profile.email

export interface ProfileErrors {
  firstName?: string
  lastName?: string
  email?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateDraft(draft: ProfileDraft, emailEditable: boolean, t: TFunction): ProfileErrors {
  const errors: ProfileErrors = {}
  const firstName = cleanName(draft.firstName)
  const lastName = cleanName(draft.lastName)

  if (!firstName) errors.firstName = t('profile.errFirstName')
  else if (firstName.length > NAME_MAX_LENGTH) errors.firstName = t('profile.errMaxLength', { max: NAME_MAX_LENGTH })
  if (lastName.length > NAME_MAX_LENGTH) errors.lastName = t('profile.errMaxLength', { max: NAME_MAX_LENGTH })
  if (emailEditable && draft.email.trim() && !EMAIL_PATTERN.test(draft.email.trim())) {
    errors.email = t('profile.errEmail')
  }
  return errors
}

export const hasErrors = (errors: ProfileErrors) => Object.keys(errors).length > 0

/** True when the form differs from what is saved (names compared after cleaning). */
export const isDraftChanged = (draft: ProfileDraft, saved: ProfileDraft) =>
  cleanName(draft.firstName) !== cleanName(saved.firstName) ||
  cleanName(draft.lastName) !== cleanName(saved.lastName) ||
  draft.email.trim() !== saved.email.trim() ||
  !avatarsEqual(draft.avatar, saved.avatar)
