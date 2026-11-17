/**
 * User codes: what a person tells someone so they can share a dua or collection with them.
 * Format: two initials and four random characters, shown as `BG-7K3M` and stored as `BG7K3M`.
 * The random part never uses 0, O, 1, I or L, so a code can be read out loud or typed without
 * mistakes (31 characters => about 923,000 codes per pair of initials).
 *
 * The backend generates the code once, at first sign-in, and checks that nobody has it (retrying if
 * someone does). A name change never changes the code. The functions here are the rules in code, so
 * the backend and the app can follow the same ones.
 */

/** 23 letters (no I, L, O) and the digits 2-9. */
export const USER_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const USER_CODE_SUFFIX_LENGTH = 4
/** Used when the last name is missing or a name is not written in Latin letters. */
export const FALLBACK_USER_CODE_PREFIX = 'UU'

const USER_CODE_PATTERN = new RegExp(`^[A-Z]{2}[${USER_CODE_ALPHABET}]{${USER_CODE_SUFFIX_LENGTH}}$`)

/** A whole number from 0 up to (not including) `maxExclusive`. */
export type RandomInt = (maxExclusive: number) => number

// Fine for the mock data and tests. The backend should use a secure random source: a code that is
// hard to guess is what keeps people from finding users they were not given a code for.
const defaultRandomInt: RandomInt = (maxExclusive) => Math.floor(Math.random() * maxExclusive)

/** First Latin letter of a name (accents removed), or null if it does not start with one. */
const latinInitial = (name?: string): string | null => {
  const letter = (name ?? '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').charAt(0).toUpperCase()
  return /^[A-Z]$/.test(letter) ? letter : null
}

/** The two initials, or `UU` if there is no last name or either name does not start with a Latin letter. */
export function getUserCodePrefix(firstName: string, lastName?: string): string {
  const first = latinInitial(firstName)
  const last = latinInitial(lastName)
  return first && last ? first + last : FALLBACK_USER_CODE_PREFIX
}

/** A new code in stored form ('BG7K3M'). It does not check that the code is free: see generateUniqueUserCode. */
export function generateUserCode(firstName: string, lastName?: string, randomInt: RandomInt = defaultRandomInt): string {
  let suffix = ''
  for (let i = 0; i < USER_CODE_SUFFIX_LENGTH; i++) suffix += USER_CODE_ALPHABET[randomInt(USER_CODE_ALPHABET.length)]
  return getUserCodePrefix(firstName, lastName) + suffix
}

/** Generates codes until one is not taken. Throws after `maxAttempts` misses (it should never happen). */
export function generateUniqueUserCode(
  firstName: string,
  lastName: string | undefined,
  isTaken: (code: string) => boolean,
  randomInt: RandomInt = defaultRandomInt,
  maxAttempts = 20,
): string {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = generateUserCode(firstName, lastName, randomInt)
    if (!isTaken(code)) return code
  }
  throw new Error('Could not find a free user code')
}

/** What was typed, reduced to the stored form: capitals only, with spaces, hyphens and dashes removed. */
export const normalizeUserCode = (input: string): string =>
  input.replace(/[\s\u200B-\u200D\uFEFF\u002D\u2010-\u2015\u2212]+/g, '').toUpperCase()

/** True for a code in stored form ('BG7K3M'). */
export const isValidUserCode = (code: string): boolean => USER_CODE_PATTERN.test(code)

/** The code to look up from what the user typed, or null if it cannot be a code (so no request is needed). */
export function parseUserCodeInput(input: string): string | null {
  const code = normalizeUserCode(input)
  return isValidUserCode(code) ? code : null
}

/** 'BG7K3M' -> 'BG-7K3M'. */
export const formatUserCode = (code: string): string => (code.length > 2 ? `${code.slice(0, 2)}-${code.slice(2)}` : code)
