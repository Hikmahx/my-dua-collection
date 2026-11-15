import { TasbihCounter } from '@/components/tasbih/tasbih-counter'
import { TasbihCustomTargetModal } from '@/components/tasbih/tasbih-custom-target-modal'
import { TasbihDuaDetailModal } from '@/components/tasbih/tasbih-dua-detail-modal'
import { TasbihDuaHeader } from '@/components/tasbih/tasbih-dua-header'
import { TasbihDuaPreview } from '@/components/tasbih/tasbih-dua-preview'
import { TasbihDuaPickerModal } from '@/components/tasbih/tasbih-dua-picker-modal'
import { TasbihFeedbackToggles } from '@/components/tasbih/tasbih-feedback-toggles'
import { TasbihResetButton } from '@/components/tasbih/tasbih-reset-button'
import { TasbihTargetSelector } from '@/components/tasbih/tasbih-target-selector'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { ScreenHeader } from '@/components/ui/screen-header'
import { MAX_COUNT, PRESET_TARGETS } from '@/constants/tasbih-config'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useTasbihFeedback } from '@/hooks/use-tasbih-feedback'
import { findTasbihItem, isCompletionCount, type TasbihItem } from '@/lib/tasbih-utils'
import tw from '@/lib/tailwind'
import { increment, resetCount, selectDhikr, setTarget } from '@/redux/reducers/tasbihSlice'
import type { RootState } from '@/redux/store'
import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector, useStore } from 'react-redux'

// A Modal can't open while another one is still closing (iOS ignores it), so a modal or
// confirmation that follows another modal waits for that one to finish closing.
const AFTER_MODAL_CLOSE_MS = 350

export default function TasbihScreen() {
  const isDark = useColorScheme() === 'dark'
  const dispatch = useDispatch()
  const store = useStore<RootState>()

  const { count, target, dhikrId } = useSelector((s: RootState) => s.tasbih)
  const duas = useSelector((s: RootState) => s.duas.items)
  const language = useSelector((s: RootState) => s.settings.language)
  const feedback = useTasbihFeedback()

  const item = useMemo(() => findTasbihItem(dhikrId, duas, language), [dhikrId, duas, language])

  const [shakeSignal, setShakeSignal] = useState(0)
  const [detailOpen, setDetailOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [pendingTarget, setPendingTarget] = useState<number | null>(null)
  const [pendingDhikr, setPendingDhikr] = useState<TasbihItem | null>(null)

  const handleTap = useCallback(() => {
    // read back from the store so very fast taps never use a stale count
    if (store.getState().tasbih.count >= MAX_COUNT) return // at the limit: ignore the tap
    dispatch(increment())
    const { count: next, target: goal, vibrationEnabled } = store.getState().tasbih
    if (isCompletionCount(next, goal)) {
      feedback.targetReached()
      if (vibrationEnabled) setShakeSignal((n) => n + 1) // shake along with the vibration
    } else {
      feedback.tap()
    }
  }, [dispatch, store, feedback])

  /** Changing the target starts a new round, so ask first when there is progress to lose. */
  const requestTarget = (next: number, delayMs = 0) => {
    if (next === target) return
    if (count > 0) setTimeout(() => setPendingTarget(next), delayMs)
    else dispatch(setTarget(next))
  }

  /** Same for changing the dua: it resets the count, so ask first when there is progress to lose. */
  const handleSelectDhikr = (picked: TasbihItem) => {
    setPickerOpen(false)
    if (picked.id === dhikrId) return
    if (count > 0) setTimeout(() => setPendingDhikr(picked), AFTER_MODAL_CLOSE_MS)
    else dispatch(selectDhikr(picked.id))
  }

  /** "Change dua" in the full-dua modal: close it, then open the picker. */
  const handleChangeDua = () => {
    setDetailOpen(false)
    setTimeout(() => setPickerOpen(true), AFTER_MODAL_CLOSE_MS)
  }

  const isCustomTarget = !(PRESET_TARGETS as readonly number[]).includes(target)

  return (
    <View style={{ flex: 1, backgroundColor: Colors[isDark ? 'dark' : 'light'].screenBody }}>
      <ScreenHeader title='Tasbih' />

      <View style={tw`flex-1 w-full max-w-[480px] self-center px-[30px]`}>
        <View style={tw`mt-[17px]`}>
          <TasbihDuaHeader item={item} onPress={() => setDetailOpen(true)} />
        </View>

        <View style={tw`flex-1 items-center justify-center`}>
          <TasbihCounter count={count} target={target} onTap={handleTap} shakeSignal={shakeSignal} />
          <View style={tw`mt-[48px]`}>
            <TasbihResetButton disabled={count === 0} onPress={() => setResetOpen(true)} />
          </View>
        </View>

        <View style={tw`flex-row items-center justify-between pb-[30px]`}>
          <TasbihTargetSelector
            target={target}
            onSelectPreset={requestTarget}
            onSelectCustom={() => setCustomOpen(true)}
          />
          <TasbihFeedbackToggles />
        </View>
      </View>

      <TasbihDuaDetailModal
        visible={detailOpen}
        item={item}
        onChangeDua={handleChangeDua}
        onClose={() => setDetailOpen(false)}
      />

      <TasbihDuaPickerModal
        visible={pickerOpen}
        selectedId={dhikrId}
        onSelect={handleSelectDhikr}
        onClose={() => setPickerOpen(false)}
      />

      <TasbihCustomTargetModal
        visible={customOpen}
        initialValue={isCustomTarget ? target : undefined}
        onCancel={() => setCustomOpen(false)}
        onSubmit={(value) => {
          setCustomOpen(false)
          requestTarget(value, AFTER_MODAL_CLOSE_MS)
        }}
      />

      <ConfirmModal
        visible={resetOpen}
        title='Reset counter?'
        message={`Your count of ${count} will be set back to 0.`}
        confirmLabel='Reset'
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          dispatch(resetCount())
          setResetOpen(false)
        }}
      />

      <ConfirmModal
        visible={pendingTarget !== null}
        title='Change target?'
        message={`Switching to ${pendingTarget} will reset your current count of ${count}.`}
        confirmLabel='Change'
        onCancel={() => setPendingTarget(null)}
        onConfirm={() => {
          if (pendingTarget !== null) dispatch(setTarget(pendingTarget))
          setPendingTarget(null)
        }}
      />

      <ConfirmModal
        visible={pendingDhikr !== null}
        title='Change dua?'
        message={`Switching to this dua will reset your current count of ${count}.`}
        confirmLabel='Change'
        onCancel={() => setPendingDhikr(null)}
        onConfirm={() => {
          if (pendingDhikr) dispatch(selectDhikr(pendingDhikr.id))
          setPendingDhikr(null)
        }}
      >
        {pendingDhikr && <TasbihDuaPreview item={pendingDhikr} />}
      </ConfirmModal>
    </View>
  )
}
