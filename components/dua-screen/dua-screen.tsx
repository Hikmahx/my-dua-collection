import { DuaBottomBar } from '@/components/dua-screen/dua-bottom-bar'
import { DuaModals, type DuaModalKind } from '@/components/dua-screen/dua-modals'
import { DuaPage } from '@/components/dua-screen/dua-page'
import { DuaProgressBar } from '@/components/dua-screen/dua-progress-bar'
import { DuaSidebar } from '@/components/dua-screen/dua-sidebar'
import { BackButton } from '@/components/ui/back-button'
import { ScreenHeader } from '@/components/ui/screen-header'
import { useDuaPager } from '@/hooks/use-dua-pager'
import { useDuaScreenColors } from '@/hooks/use-dua-screen-colors'
import { toggleFavorite, type Dua } from '@/redux/reducers/duasSlice'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { useDispatch } from 'react-redux'

interface DuaScreenProps {
  /** The collection name (or "Favorites"), shown in the header. */
  title: string
  /** The duas to swipe through, in order. */
  duas: Dua[]
  initialIndex: number
  onBack: () => void
}

/**
 * One dua at a time, full screen. Swipe to the next or previous dua, tap the counter to count
 * down the repeats (the next dua slides in when it reaches 0). The kebab icon opens the
 * Appearance and Language settings as a sidebar; audio, share and info open dialogs.
 */
export function DuaScreen({ title, duas, initialIndex, onBack }: DuaScreenProps) {
  const c = useDuaScreenColors()
  const dispatch = useDispatch()
  const { listRef, width, index, dua, repeat, remaining, tap, onSwipeEnd } = useDuaPager(duas, initialIndex)
  const [modal, setModal] = useState<DuaModalKind | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <View style={{ flex: 1, backgroundColor: c.body }}>
      <ScreenHeader
        title={title}
        bottomPadding={14}
        left={<BackButton onPress={onBack} color={c.icon} />}
        right={
          <Pressable
            onPress={() => setSidebarOpen(true)}
            hitSlop={12}
            accessibilityRole='button'
            accessibilityLabel='Settings'
          >
            <Feather name='more-vertical' size={22} color={c.icon} />
          </Pressable>
        }
      />
      <DuaProgressBar progress={(index + 1) / duas.length} />

      <FlatList
        ref={listRef}
        data={duas}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled // one dua per swipe; also stops you swiping before the first or after the last
        bounces={false}
        overScrollMode='never'
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={onSwipeEnd}
        renderItem={({ item, index: position }) => (
          <DuaPage
            dua={item}
            position={position + 1}
            total={duas.length}
            width={width}
            onOpenVirtue={() => setModal('info')}
          />
        )}
      />

      <DuaBottomBar
        remaining={remaining}
        progress={1 - remaining / repeat}
        onTap={tap}
        isFavorite={dua.isFavorite}
        onPlay={() => setModal('audio')}
        onToggleFavorite={() => dispatch(toggleFavorite(dua.id))}
        onShare={() => setModal('share')}
        onInfo={() => setModal('info')}
      />

      <DuaModals kind={modal} dua={dua} onClose={() => setModal(null)} />
      <DuaSidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  )
}
