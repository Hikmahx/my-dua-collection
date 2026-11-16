/**
 * Turns a touch position on a slider into a value. The thumb centre travels from thumb/2 to
 * width - thumb/2, so the touch position is mapped over that range, then snapped to the step.
 */
export function sliderValueFromX(
  x: number,
  width: number,
  thumb: number,
  min: number,
  max: number,
  step: number,
): number {
  const travel = Math.max(1, width - thumb)
  const ratio = Math.min(1, Math.max(0, (x - thumb / 2) / travel))
  const stepped = min + Math.round((ratio * (max - min)) / step) * step
  return Math.min(max, Math.max(min, stepped))
}

/** 0-1 position of a value between min and max. */
export const sliderRatio = (value: number, min: number, max: number) =>
  max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)))
