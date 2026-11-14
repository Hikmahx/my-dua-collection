/** Quick-pick targets shown as pills. "Custom" covers every other number. */
export const PRESET_TARGETS = [33, 100] as const
export const DEFAULT_TARGET = 100
export const MAX_TARGET = 99999

/**
 * When the count reaches the target the phone gives completion feedback, and again for
 * the next taps: target, target + 1, target + 2 (3 in total). After that it goes quiet
 * while the counter keeps going.
 */
export const COMPLETION_FEEDBACK_COUNT = 3

/** A light tick (haptic and/or sound) on every tap. Set to false to only give feedback at the target. */
export const FEEDBACK_ON_EVERY_TAP = true
