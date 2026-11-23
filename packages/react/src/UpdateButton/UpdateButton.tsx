import { ArrowClockwise, ArrowDown, Warning } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface UpdateButtonProps {
  state: 'available' | 'downloading' | 'ready' | 'failed'
  /** downloading: 0–1 */
  progress?: number
  /** The state in words (업데이트 · 받는 중 · 재시작 · 업데이트 실패) */
  label: string
  onClick(): void
}

/** The update, in the chosen thing's yellow; every state says itself in words */
export function UpdateButton({ state, progress, label, onClick }: UpdateButtonProps) {
  const pct = state === 'downloading' && progress !== undefined ? ` ${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` : ''
  const glyph = state === 'ready' ? ArrowClockwise : state === 'failed' ? Warning : ArrowDown
  return (
    <button type="button" className={`sp-update sp-update--${state}`} aria-label={`${label}${pct}`} title={`${label}${pct}`} disabled={state === 'downloading'} onClick={onClick}>
      <Icon icon={glyph} size={12} /><span>{label}{pct}</span>
    </button>
  )
}
