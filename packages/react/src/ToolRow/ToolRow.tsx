import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { CaretRight } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface ToolRowProps {
  icon?: PhosphorIcon
  /** The tool (Bash, Read …) */
  label: string
  /** What it worked on (a command, a path) */
  detail?: string
  mono?: boolean
  /** At the right (a time, counts) */
  meta?: React.ReactNode
  /** An error line beside the label */
  error?: string
  state?: 'done' | 'wait' | 'fail'
  open?: boolean
  onToggle?(): void
  /** A button at the head's end (open in the terminal), shown on hover or focus */
  action?: React.ReactNode
  /** The body: output, a diff, nested rows */
  children?: React.ReactNode
  className?: string
}

/** One tool call in the conversation: a quiet line that opens to what it did */
export function ToolRow({ icon, label, detail, mono, meta, error, state = 'done', open, onToggle, action, children, className }: ToolRowProps) {
  const head = <>
    {children !== undefined && <span className="sp-tool__chev" aria-hidden="true"><Icon icon={CaretRight} size={12} /></span>}
    {icon && <span className="sp-tool__ico" aria-hidden="true"><Icon icon={icon} size={14} /></span>}
    <span className="sp-tool__label">{label}</span>
    {detail && <span className={`sp-tool__detail${mono ? ' sp-tool__detail--mono' : ''}`} title={detail}>{detail}</span>}
    {error && <span className="sp-tool__err" title={error}>{error}</span>}
  </>
  return (
    <div className={`sp-tool sp-tool--${state}${open ? ' sp-tool--open' : ''}${className ? ` ${className}` : ''}`}>
      <div className="sp-tool__head">
        {onToggle ? <button type="button" className="sp-tool__toggle" aria-expanded={!!open} onClick={onToggle}>{head}</button> : <span className="sp-tool__toggle">{head}</span>}
        {meta && <span className="sp-tool__meta">{meta}</span>}
        {action && <span className="sp-tool__action">{action}</span>}
      </div>
      {open && children !== undefined && <div className="sp-tool__body">{children}</div>}
    </div>
  )
}
