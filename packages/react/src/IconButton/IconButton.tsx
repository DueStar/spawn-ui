import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import React, { forwardRef } from 'react'
import { Icon } from '../Icon/Icon'

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** What it does: its name for screen readers and its tooltip */
  label: string
  icon: PhosphorIcon
  /** xs 20px (a tab's ×) · sm 22px (a chip's ×) · md 24×22 (the window bar, the default) · head 26px (the side panel's header) · lg 38px (the folded rail) */
  size?: 'xs' | 'sm' | 'md' | 'head' | 'lg'
  /** Shown while pressed (a toggle): aria-pressed */
  pressed?: boolean
}

const GLYPH = { xs: 12, sm: 12, md: 14, head: 14, lg: 16 } as const

/** A button with only an icon; its label is said and shown on hover */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ label, icon, size = 'md', pressed, type = 'button', className, title, ...rest }, ref) {
  return (
    <button ref={ref} type={type} aria-label={label} title={title ?? label} aria-pressed={pressed}
      className={`sp-icon-button sp-icon-button--${size}${className ? ` ${className}` : ''}`} {...rest}>
      <Icon icon={icon} size={GLYPH[size]} />
    </button>
  )
})
