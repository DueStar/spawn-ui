import { CaretDown, CaretUp, X } from '@phosphor-icons/react'
import React from 'react'
import { isComposing } from '../composing'
import { IconButton } from '../IconButton/IconButton'

export interface FindBarProps {
  /** The field's name for screen readers */
  label: string
  value: string
  onChange(value: string): void
  /** Which hit is shown, of how many */
  count?: { current: number; total: number }
  onNext(): void
  onPrev(): void
  onClose(): void
  /** A line under it (the chat's: what it searches) */
  note?: React.ReactNode
  /** chat (the default) · term: the terminal's */
  size?: 'chat' | 'term'
  /** The buttons' names */
  labels?: { next: string; prev: string; close: string }
  className?: string
}

/** Find in a conversation or a terminal: floats at the top right. Enter next, Shift+Enter previous, Esc closes. */
export function FindBar({ label, value, onChange, count, onNext, onPrev, onClose, note, size = 'chat', labels = { next: 'Next', prev: 'Previous', close: 'Close' }, className }: FindBarProps) {
  const keys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing(e)) return
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); onClose() }
    else if (e.key === 'Enter') { e.preventDefault(); if (e.shiftKey) onPrev(); else onNext() }
  }
  return (
    <div className={`sp-find sp-find--${size}${className ? ` ${className}` : ''}`}>
      <div className="sp-find__main">
        <input type="search" autoFocus aria-label={label} className="sp-find__input" value={value} onChange={e => onChange(e.target.value)} onKeyDown={keys} />
        <span className="sp-find__count" aria-live="polite">{count ? `${count.current}/${count.total}` : ''}</span>
        <IconButton icon={CaretUp} label={labels.prev} onClick={onPrev} disabled={!count?.total} />
        <IconButton icon={CaretDown} label={labels.next} onClick={onNext} disabled={!count?.total} />
        <IconButton icon={X} label={labels.close} onClick={onClose} />
      </div>
      {note && <div className="sp-find__note">{note}</div>}
    </div>
  )
}
