import type { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

/** How many notifications in the centre have not been opened. */
export const useUnreadCount = () =>
  useSelector((state: RootState) => state.notifications.items.filter((item) => !item.read).length)
