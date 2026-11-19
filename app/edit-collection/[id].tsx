import { EditCollectionScreen } from '@/components/collection-edit/edit-collection-screen'
import { useLocalSearchParams } from 'expo-router'

/** Edit one of the user's collections (opened from "Edit collection" in the Collection screen's menu). */
export default function EditCollectionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <EditCollectionScreen collectionId={id} />
}
