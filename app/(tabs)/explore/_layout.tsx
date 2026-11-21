import { Stack } from 'expo-router'

/** Explore is a stack inside the tab, so the topic lists, articles and chat keep the tab bar. */
export default function ExploreLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
