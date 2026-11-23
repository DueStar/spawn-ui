import { CaretUp } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface QueueStripProps {
  /** How many wait, in words (대기 중 2) */
  label: string
  /** The first one waiting, on the strip */
  first: string
  items: React.ReactNode[]
  open: boolean
  onToggle(): void
}

/** Messages waiting while Claude works: a strip over the composer, opening into the list */
export function QueueStrip({ label, first, items, open, onToggle }: QueueStripProps) {
  return (
    <div className={`sp-queue-wrap${open ? ' sp-queue-wrap--open' : ''}`}>
      {open && <ol className="sp-queue__list">{items.map((it, i) => <li key={i}><span className="sp-queue__n">{i + 1}</span><span className="sp-queue__full">{it}</span></li>)}</ol>}
      <button type="button" className="sp-queue" aria-expanded={open} onClick={onToggle}>
        <span className="sp-queue__label">{label}</span>
        {!open && <span className="sp-queue__text">{first}</span>}
        <span className="sp-queue__chev" aria-hidden="true"><Icon icon={CaretUp} size={12} /></span>
      </button>
    </div>
  )
}
