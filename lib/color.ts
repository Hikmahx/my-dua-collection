/** Multiplies each channel of '#RRGGBB' by a factor (below 1 = darker, above 1 = lighter). */
export function scaleColor(hex: string, factor: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const channel = (shift: number) =>
    Math.min(255, Math.max(0, Math.round(((n >> shift) & 255) * factor)))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(16)}${channel(8)}${channel(0)}`.toUpperCase()
}

export const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)
