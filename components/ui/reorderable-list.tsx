import { DUA_ROW_GAP, DUA_ROW_HEIGHT } from '@/constants/dua-config'
import {
  autoScrollDelta,
  idsFromPositions,
  indexFromOffset,
  moveItem,
  moveTo,
  positionsFromIds,
  type Positions,
} from '@/lib/reorder'
import tw from '@/lib/tailwind'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Text, View, type StyleProp, type ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  measure,
  runOnJS,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useFrameCallback,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated'

/** How long the grip is held before the row lifts and can be dragged. */
const LONG_PRESS_MS = 140
const MOVE_MS = 160

interface DragState {
  positions: SharedValue<Positions>
  activeId: SharedValue<string | null>
  dragY: SharedValue<number>
  begin: (id: string, fingerY: number) => void
  move: (fingerY: number) => void
  end: () => void
}

export interface ReorderableListProps<T extends { id: string }> {
  items: T[]
  /** Called with the new order of ids when a drag ends in a different place. */
  onReorder: (ids: string[]) => void
  /**
   * The content of one row. It fills a row that is `rowHeight` tall: draw the background and corners
   * yourself, and put `handle` (the grip the user drags) where you want it.
   */
  renderRow: (item: T, index: number, handle: ReactNode) => ReactNode
  /** Names the row for screen readers: "Reorder <label>". */
  getLabel: (item: T) => string
  handleColor: string
  rowHeight?: number
  rowGap?: number
  emptyMessage: string
  emptyColor: string
  contentContainerStyle?: StyleProp<ViewStyle>
}

/**
 * A scrolling list whose rows the user drags into a new order by pressing and holding the grip.
 * The rows must all be the same height. It scrolls by itself while a row is dragged near the top or
 * bottom, and does not keep any order of its own: it reports each change through `onReorder` and
 * shows whatever order `items` has. Used by the Edit collection screen and by Favorites.
 */
export function ReorderableList<T extends { id: string }>({
  items,
  onReorder,
  renderRow,
  getLabel,
  handleColor,
  rowHeight = DUA_ROW_HEIGHT,
  rowGap = DUA_ROW_GAP,
  emptyMessage,
  emptyColor,
  contentContainerStyle,
}: ReorderableListProps<T>) {
  const pitch = rowHeight + rowGap
  const ids = useMemo(() => items.map((item) => item.id), [items])
  const idsKey = ids.join('|')
  const [dragging, setDragging] = useState(false)

  // UI-thread state of the drag
  const positions = useSharedValue<Positions>(positionsFromIds(ids))
  const count = useSharedValue(ids.length)
  const activeId = useSharedValue<string | null>(null)
  const dragY = useSharedValue(0)
  const fingerY = useSharedValue(0)
  const startFingerY = useSharedValue(0)
  const startRowY = useSharedValue(0)
  const startScrollY = useSharedValue(0)
  const contentHeight = useSharedValue(0)
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollY = useScrollViewOffset(scrollRef)

  // the list changed (a row was removed, or the order was saved): the rows take their places
  useEffect(() => {
    const current = idsKey ? idsKey.split('|') : []
    positions.value = positionsFromIds(current)
    count.value = current.length
  }, [idsKey, positions, count])

  const commit = useCallback(
    (newIds: string[]) => {
      setDragging(false)
      if (newIds.join('|') !== idsKey) onReorder(newIds)
    },
    [idsKey, onReorder],
  )

  /** Puts the dragged row under the finger (allowing for how far the list has scrolled) and shifts the others. */
  const updateDrag = () => {
    'worklet'
    const id = activeId.value
    if (id === null) return
    const y = startRowY.value + (fingerY.value - startFingerY.value) + (scrollY.value - startScrollY.value)
    const clamped = Math.min(Math.max(y, 0), Math.max(count.value - 1, 0) * pitch)
    dragY.value = clamped
    const target = indexFromOffset(clamped, pitch, count.value)
    if (positions.value[id] !== target) positions.value = moveTo(positions.value, id, target)
  }

  const drag: DragState = {
    positions,
    activeId,
    dragY,
    begin: (id, y) => {
      'worklet'
      activeId.value = id
      fingerY.value = y
      startFingerY.value = y
      startRowY.value = (positions.value[id] ?? 0) * pitch
      startScrollY.value = scrollY.value
      dragY.value = startRowY.value
      runOnJS(setDragging)(true)
    },
    move: (y) => {
      'worklet'
      fingerY.value = y
      updateDrag()
    },
    end: () => {
      'worklet'
      if (activeId.value === null) return
      activeId.value = null
      runOnJS(commit)(idsFromPositions(positions.value))
    },
  }

  // While a row is held near the top or bottom, keep scrolling even if the finger is still
  useFrameCallback(() => {
    if (activeId.value === null) return
    const view = measure(scrollRef)
    if (!view) return
    const delta = autoScrollDelta(fingerY.value, view.pageY, view.pageY + view.height)
    if (delta !== 0) {
      const maxScroll = Math.max(0, contentHeight.value - view.height)
      const next = Math.min(Math.max(scrollY.value + delta, 0), maxScroll)
      if (next !== scrollY.value) scrollTo(scrollRef, 0, next, false)
    }
    updateDrag()
  })

  const moveBy = useCallback(
    (id: string, step: number) => {
      const from = ids.indexOf(id)
      const reordered = moveItem(ids, from, from + step)
      if (reordered !== ids) onReorder(reordered)
    },
    [ids, onReorder],
  )

  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollEnabled={!dragging}
      showsVerticalScrollIndicator
      onContentSizeChange={(_, height) => {
        contentHeight.value = height
      }}
      contentContainerStyle={contentContainerStyle ?? tw`px-[16px] pb-[24px]`}
    >
      {items.length === 0 ? (
        <Text style={[tw`font-nunito text-[14px] text-center mt-[32px]`, { color: emptyColor }]}>{emptyMessage}</Text>
      ) : (
        <View style={{ height: items.length * pitch - rowGap }}>
          {items.map((item, index) => (
            <SortableRow
              key={item.id}
              id={item.id}
              label={getLabel(item)}
              index={index}
              pitch={pitch}
              rowHeight={rowHeight}
              drag={drag}
              handleColor={handleColor}
              onMoveBy={moveBy}
            >
              {(handle) => renderRow(item, index, handle)}
            </SortableRow>
          ))}
        </View>
      )}
    </Animated.ScrollView>
  )
}

interface SortableRowProps {
  id: string
  label: string
  /** Where the row is in the list right now (only used for its first place). */
  index: number
  pitch: number
  rowHeight: number
  drag: DragState
  handleColor: string
  onMoveBy: (id: string, step: number) => void
  children: (handle: ReactNode) => ReactNode
}

/** Positions one row, slides it when others move, lifts it while it is dragged, and owns its grip. */
function SortableRow({ id, label, index, pitch, rowHeight, drag, handleColor, onMoveBy, children }: SortableRowProps) {
  const { positions, activeId, dragY } = drag
  const y = useSharedValue(index * pitch)

  // another row was dragged past this one: slide to the new place
  useAnimatedReaction(
    () => positions.value[id],
    (position) => {
      if (position !== undefined && activeId.value !== id) y.value = withTiming(position * pitch, { duration: MOVE_MS })
    },
  )
  // this row was let go: settle from where the finger left it into its place
  useAnimatedReaction(
    () => activeId.value === id,
    (isActive, wasActive) => {
      if (wasActive && !isActive) {
        y.value = dragY.value
        y.value = withTiming((positions.value[id] ?? 0) * pitch, { duration: MOVE_MS })
      }
    },
  )

  const animatedStyle = useAnimatedStyle(() => {
    const active = activeId.value === id
    return {
      transform: [{ translateY: active ? dragY.value : y.value }, { scale: withTiming(active ? 1.02 : 1, { duration: 120 }) }],
      zIndex: active ? 10 : 0,
      elevation: active ? 6 : 0,
      shadowOpacity: active ? 0.25 : 0,
    }
  })

  const pan = Gesture.Pan()
    .activateAfterLongPress(LONG_PRESS_MS)
    .onStart((event) => {
      drag.begin(id, event.absoluteY)
    })
    .onUpdate((event) => {
      drag.move(event.absoluteY)
    })
    .onFinalize(() => {
      if (activeId.value === id) drag.end()
    })

  const handle = (
    <GestureDetector gesture={pan}>
      <View
        accessible
        accessibilityRole='adjustable'
        accessibilityLabel={`Reorder ${label}`}
        accessibilityHint='Press and hold, then drag. Or use the actions to move it up or down.'
        accessibilityActions={[
          { name: 'moveUp', label: 'Move up' },
          { name: 'moveDown', label: 'Move down' },
        ]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'moveUp') onMoveBy(id, -1)
          if (event.nativeEvent.actionName === 'moveDown') onMoveBy(id, 1)
        }}
        style={tw`w-[44px] h-[44px] items-center justify-center`}
      >
        <DragDots color={handleColor} />
      </View>
    </GestureDetector>
  )

  return (
    <Animated.View
      style={[
        tw`absolute left-0 right-0 top-0`,
        { height: rowHeight, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
        animatedStyle,
      ]}
    >
      {children(handle)}
    </Animated.View>
  )
}

/** The six dots of the grip: two columns of three. */
function DragDots({ color }: { color: string }) {
  return (
    <View style={{ width: 10, height: 17, justifyContent: 'space-between' }}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
        </View>
      ))}
    </View>
  )
}
