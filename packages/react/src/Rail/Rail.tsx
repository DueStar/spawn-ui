import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'
import type { SessionMood } from '../SessionRow/SessionRow'

/** The folded side panel: a 56px column of buttons and sessions */
function RailRoot({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <nav aria-label={label} className={`sp-rail${className ? ` ${className}` : ''}`}>{children}</nav>
}
function RailSeparator() {
  return <div className="sp-rail__sep" role="separator" />
}
export const Rail = Object.assign(RailRoot, { Separator: RailSeparator })

export interface RailButtonProps {
  /** Its name (a session: its name) */
  label: string
  icon?: PhosphorIcon
  /** A session's picture (a SessionPicture at 26) */
  picture?: React.ReactNode
  mood?: SessionMood
  /** The mood in words (said with the label) */
  moodLabel?: string
  chosen?: boolean
  onClick(): void
  onPointerDown?(e: React.PointerEvent<HTMLButtonElement>): void
  className?: string
}

/** A rail button: an icon, or a session with its mood dot */
export function RailButton({ label, icon, picture, mood, moodLabel, chosen, onClick, onPointerDown, className }: RailButtonProps) {
  const name = moodLabel ? `${label} · ${moodLabel}` : label
  const cls = ['sp-rail-btn']
  if (mood) cls.push(`sp-rail-btn--${mood}`)
  if (chosen) cls.push('sp-rail-btn--chosen')
  if (className) cls.push(className)
  return (
    <button type="button" aria-label={name} title={name} aria-current={chosen ? 'true' : undefined} className={cls.join(' ')} onClick={onClick} onPointerDown={onPointerDown}>
      {picture ?? (icon && <Icon icon={icon} size={16} />)}
      {mood && <i className="sp-rail-btn__dot" aria-hidden="true" />}
    </button>
  )
}
