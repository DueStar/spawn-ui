import { X } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface SidePanelProps {
  title: React.ReactNode
  /** Its name (when the title is not plain words) */
  label?: string
  /** After the title (counts) */
  extra?: React.ReactNode
  /** A quiet line under the head */
  sub?: React.ReactNode
  /** 320 (changes) · 380 (an agent) */
  width: 320 | 380
  /** No room beside the chat: it lies over it, with a shadow */
  over?: boolean
  onClose(): void
  closeLabel: string
  children: React.ReactNode
}

/** The chat's right column (the changes, an agent): a head with its ×, its body scrolls */
export function SidePanel({ title, label, extra, sub, width, over, onClose, closeLabel, children }: SidePanelProps) {
  return (
    <aside aria-label={label ?? (typeof title === 'string' ? title : undefined)} className={`sp-side-panel${over ? ' sp-side-panel--over' : ''}`} style={{ width }}>
      <div className="sp-side-panel__head">
        <b>{title}</b>{extra}
        <button type="button" className="sp-side-panel__x" aria-label={closeLabel} title={closeLabel} onClick={onClose}><Icon icon={X} size={14} /></button>
      </div>
      {sub && <div className="sp-side-panel__sub">{sub}</div>}
      <div className="sp-side-panel__body sp-scroll--8">{children}</div>
    </aside>
  )
}
