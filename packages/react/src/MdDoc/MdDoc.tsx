import React from 'react'
import { SegmentedControl } from '../SegmentedControl/SegmentedControl'

export interface MdDocProps {
  title: React.ReactNode
  view: 'doc' | 'raw'
  onView(view: 'doc' | 'raw'): void
  /** Long: cut at 420px with a fade (the app offers more) */
  folded?: boolean
  labels: { group: string; doc: string; raw: string }
  /** The rendered document (a Prose) or the raw text */
  children: React.ReactNode
  className?: string
}

/** A Markdown file shown in the chat: the document or its source */
export function MdDoc({ title, view, onView, folded, labels, children, className }: MdDocProps) {
  return (
    <div className={`sp-mddoc${className ? ` ${className}` : ''}`}>
      <div className="sp-mddoc__head">
        <span className="sp-mddoc__title">{title}</span>
        <SegmentedControl size="sm" className="sp-mddoc__tabs" label={labels.group} value={view} onChange={onView} options={[{ value: 'doc', label: labels.doc }, { value: 'raw', label: labels.raw }]} />
      </div>
      <div className={`sp-mddoc__body${folded ? ' sp-mddoc__body--folded' : ''}${view === 'raw' ? ' sp-mddoc__body--raw' : ''}`}>{children}</div>
    </div>
  )
}
