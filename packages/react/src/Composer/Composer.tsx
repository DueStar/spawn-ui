import { ArrowUp } from '@phosphor-icons/react'
import React, { useLayoutEffect, useRef } from 'react'
import { isComposing } from '../composing'
import { Icon } from '../Icon/Icon'

export interface ComposerProps {
  /** The field's name for screen readers */
  label: string
  value: string
  onChange(value: string): void
  onSend(): void
  sendLabel: string
  placeholder?: string
  /** Claude is working: Esc stops it */
  busy?: boolean
  onStop?(): void
  stopLabel?: string
  /** A `!` command: the box's edge brighter, the text in mono */
  mode?: 'prompt' | 'shell'
  /** Picture and file chips above the text */
  chips?: React.ReactNode
  /** Buttons in the bar (attach, mention) */
  tools?: React.ReactNode
  /** A quiet line above the box (why a send did not go) */
  note?: React.ReactNode
  /** A quiet line under the box (a / command's hint) */
  hint?: React.ReactNode
  /** Beside the send (a suggestion key, the shell badge) */
  extra?: React.ReactNode
  readOnly?: boolean
  /** The control row, under the box */
  controls?: React.ReactNode
  /** The listbox the field drives (mentions, commands) */
  suggestions?: React.ReactNode
  /** The field's keys, before the composer's own (a suggestion list takes ↑ ↓ Enter first) */
  onFieldKeyDown?(e: React.KeyboardEvent<HTMLTextAreaElement>): void
  className?: string
}

/** Where you write to Claude. Enter sends, Shift+Enter is a new line, an Enter ending an IME word never sends. The send is the one yellow. */
export function Composer({ label, value, onChange, onSend, sendLabel, placeholder, busy, onStop, mode = 'prompt', chips, tools, note, hint, extra, readOnly, controls, suggestions, onFieldKeyDown, className }: ComposerProps) {
  const field = useRef<HTMLTextAreaElement>(null)
  const empty = !value.trim()
  useLayoutEffect(() => {
    const el = field.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])
  const keys = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onFieldKeyDown?.(e)
    if (e.defaultPrevented || isComposing(e)) return
    if (e.key === 'Escape' && busy && onStop) { e.preventDefault(); onStop(); return }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!empty) onSend() }
  }
  return (
    <div className={`sp-composer${className ? ` ${className}` : ''}`}>
      <div className="sp-composer__in">
        {suggestions}
        {note && <div className="sp-composer__note">{note}</div>}
        <div className={`sp-composer__box${mode === 'shell' ? ' sp-composer__box--shell' : ''}`}>
          {chips && <div className="sp-composer__chips">{chips}</div>}
          <textarea ref={field} rows={1} aria-label={label} placeholder={placeholder} className="sp-composer__input" value={value} readOnly={readOnly} aria-busy={busy || undefined}
            onChange={e => onChange(e.target.value)} onKeyDown={keys} />
          <div className="sp-composer__bar">
            {tools}
            {extra}
            <button type="button" className={`sp-composer__send${empty ? ' sp-composer__send--empty' : ''}`} aria-label={sendLabel} title={sendLabel} aria-disabled={empty || undefined} onClick={() => { if (!empty) onSend() }}>
              <Icon icon={ArrowUp} size={16} />
            </button>
          </div>
        </div>
        {hint && <div className="sp-composer__hint">{hint}</div>}
        {controls}
      </div>
    </div>
  )
}
