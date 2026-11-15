import { DuaListScreen } from '@/components/dua-list/dua-list-screen'
import { getCollectionName } from '@/constants/collections'
import type { RootState } from '@/redux/store'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/** The duas of one collection (opened from a collection card on Home). */
export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const allDuas = useSelector((state: RootState) => state.duas.items)

  const duas = useMemo(() => allDuas.filter((dua) => dua.categories.includes(id)), [allDuas, id])

  return (
    <DuaListScreen
      title={getCollectionName(id)}
      duas={duas}
      onBack={() => router.back()}
      emptyMessage='No duas in this collection yet'
    />
  )
}
