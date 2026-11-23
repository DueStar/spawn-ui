import React, { forwardRef } from 'react'
import { isComposing } from '../composing'

type Base = Omit<React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'onSubmit'>

export interface TextInputProps extends Base {
  /** Its name for screen readers (left out when a <label> points at it) */
  label?: string
  /** form: a settings field (the default) · rename: a name edited in place · card: a field on a chat card · note: a feedback box */
  look?: 'form' | 'rename' | 'card' | 'note'
  /** A form field's padding: times 4px 6px · tool 6px 9px (the default) · rank 6px 10px, 180 wide */
  size?: 'times' | 'tool' | 'rank'
  /** Several lines (a textarea); the note look is always one */
  multiline?: boolean
  /** Monospace (a command, a path) */
  mono?: boolean
  /** A width in px */
  width?: number
  /** Enter (Ctrl/⌘+Enter when multiline), never while composing */
  onSubmit?(value: string): void
  /** Esc, never while composing */
  onCancel?(): void
}

/** A text field, in spawn's looks. Focus shows by its border turning lighter. */
export const TextInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextInputProps>(function TextInput(
  { label, look = 'form', size = 'tool', multiline, mono, width, onSubmit, onCancel, onKeyDown, className, style, ...rest }, ref) {
  const area = multiline || look === 'note'
  const cls = ['sp-text-input', `sp-text-input--${look}`]
  if (look === 'form') cls.push(`sp-text-input--${size}`)
  if (mono) cls.push('sp-text-input--mono')
  if (className) cls.push(className)
  const keys = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onKeyDown?.(e as never)
    if (e.defaultPrevented || isComposing(e)) return
    if (e.key === 'Escape' && onCancel) { e.preventDefault(); onCancel(); return }
    if (e.key === 'Enter' && onSubmit && (!area || e.ctrlKey || e.metaKey)) { e.preventDefault(); onSubmit((e.currentTarget as HTMLInputElement).value) }
  }
  const common = { 'aria-label': label, className: cls.join(' '), style: width ? { ...style, width } : style, onKeyDown: keys }
  return area
    ? <textarea ref={ref as React.Ref<HTMLTextAreaElement>} {...common} {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
    : <input ref={ref as React.Ref<HTMLInputElement>} type="text" {...common} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
})
