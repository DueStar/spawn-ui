import { ArrowUp } from '@phosphor-icons/react'
import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
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
  /** Something can be sent (default: the text is not empty; pass true when a picture or file is attached) */
  canSend?: boolean
  /** A send is on its way: the draft quieter (aria-busy), no second send */
  sending?: boolean
  /** Claude is working: Esc (plain) stops it */
  working?: boolean
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
  /** An ended session: nothing is sent */
  readOnly?: boolean
  /** The control row, under the box */
  controls?: React.ReactNode
  /** The listbox the field drives (a SuggestionList) */
  suggestions?: React.ReactNode
  /** More on the textarea: aria-controls / aria-activedescendant / aria-autocomplete for a SuggestionList (`${id}-${index}`), onPaste, onSelect, onBlur … */
  fieldProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement> & Record<`aria-${string}`, unknown>
  /** The field's keys, before the composer's own and never while an IME composes (a suggestion list takes ↑ ↓ Enter first: preventDefault to keep them) */
  onFieldKeyDown?(e: React.KeyboardEvent<HTMLTextAreaElement>): void
  className?: string
}

const plain = (e: React.KeyboardEvent) => !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey

/** Where you write to Claude. Enter sends, Shift+Enter is a new line, an Enter ending an IME word never sends. The send is the one yellow. The ref is the textarea. */
export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer({ label, value, onChange, onSend, sendLabel, placeholder, canSend, sending, working, onStop, mode = 'prompt', chips, tools, note, hint, extra, readOnly, controls, suggestions, fieldProps, onFieldKeyDown, className }, ref) {
  const field = useRef<HTMLTextAreaElement>(null)
  const twin = useRef<HTMLTextAreaElement>(null)
  useImperativeHandle(ref, () => field.current as HTMLTextAreaElement)
  const ready = (canSend ?? value.trim().length > 0) && !readOnly && !sending
  // the height from a hidden twin: the field itself never collapses (the conversation above would spring back a line)
  useLayoutEffect(() => {
    const el = field.current, tw = twin.current
    if (!el || !tw) return
    tw.style.width = `${el.clientWidth}px`
    tw.value = value
    const h = Math.min(tw.scrollHeight, 160)
    el.style.height = `${Math.max(h, 22)}px`
    el.style.overflowY = tw.scrollHeight > 160 ? 'auto' : 'hidden'
  }, [value])
  const send = () => { if (ready) onSend() }
  const keys = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposing(e)) return
    onFieldKeyDown?.(e)
    fieldProps?.onKeyDown?.(e)
    if (e.defaultPrevented) return
    if (e.key === 'Escape' && plain(e) && working && onStop) { e.preventDefault(); onStop(); return }
    if (e.key === 'Enter' && plain(e)) { e.preventDefault(); send() }
  }
  return (
    <div className={`sp-composer${className ? ` ${className}` : ''}`}>
      <div className="sp-composer__in">
        {suggestions}
        {note && <div className="sp-composer__note">{note}</div>}
        <div className={`sp-composer__box${mode === 'shell' ? ' sp-composer__box--shell' : ''}`}>
          {chips && <div className="sp-composer__chips">{chips}</div>}
          <textarea rows={1} aria-label={label} placeholder={placeholder} className="sp-composer__input" readOnly={readOnly} aria-busy={sending || undefined}
            {...fieldProps} ref={field} value={value} onChange={e => onChange(e.target.value)} onKeyDown={keys} />
          <textarea ref={twin} rows={1} className="sp-composer__input sp-composer__twin" aria-hidden="true" tabIndex={-1} readOnly value={value} />
          <div className="sp-composer__bar">
            {tools}
            {extra}
            <button type="button" className={`sp-composer__send${ready ? '' : ' sp-composer__send--empty'}`} aria-label={sendLabel} title={sendLabel} aria-disabled={!ready || undefined} onClick={send}>
              <Icon icon={ArrowUp} size={16} />
            </button>
          </div>
        </div>
        {hint && <div className="sp-composer__hint">{hint}</div>}
        {controls}
      </div>
    </div>
  )
})
