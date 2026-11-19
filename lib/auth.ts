import { data, type AuthProvider, type User } from '@/data'

/**
 * Signs in with Google or Facebook and returns the user.
 *
 * PLACEHOLDER until real login exists: it returns the sample user of that provider from
 * data/user.json, so both the signed-in and signed-out screens can be tried. The real version
 * runs the provider's sign-in, sends the result to the backend (which creates the user and their
 * user code on the first sign-in) and returns that user. Nothing outside this file needs to change.
 */
export async function signInWithProvider(provider: AuthProvider): Promise<User> {
  const user = data.users.find((candidate) => candidate.authProvider === provider)
  if (!user) throw new Error(`No sample user for ${provider}`)
  return user
}
