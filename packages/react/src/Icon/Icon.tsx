import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import React from 'react'

/** spawn's icon sizes: a button's 16, an inline 14, a small 12 (src/components/Icons.tsx in spawn) */
export const ICON_SIZES = Object.freeze({ button: 16, inline: 14, small: 12 })
/** One weight for every icon */
export const ICON_WEIGHT = 'bold' as const
/** A size snapped to the nearest step; a picture-sized one (over 17) keeps its size */
export const iconStep = (size: number): number => (size > 17 ? size : size <= 12.5 ? ICON_SIZES.small : size < 15 ? ICON_SIZES.inline : ICON_SIZES.button)

export interface IconProps {
  /** A Phosphor icon (`import { Gear } from '@phosphor-icons/react'`) */
  icon: PhosphorIcon
  /** Pixels; snapped to 12, 14 or 16 */
  size?: number
  /** Said to screen readers; without it the icon is decoration */
  label?: string
  className?: string
}

/** A Phosphor icon at spawn's weight and sizes */
export function Icon({ icon: Glyph, size = ICON_SIZES.button, label, className }: IconProps) {
  const cls = `sp-icon${className ? ` ${className}` : ''}`
  return label
    ? <Glyph className={cls} size={iconStep(size)} weight={ICON_WEIGHT} role="img" aria-label={label} focusable="false" />
    : <Glyph className={cls} size={iconStep(size)} weight={ICON_WEIGHT} aria-hidden="true" focusable="false" />
}
