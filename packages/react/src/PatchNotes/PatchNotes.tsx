import React from 'react'
import { Dialog } from '../Dialog/Dialog'

export interface PatchNotesProps {
  open: boolean
  onClose(): void
  title: string
  okLabel: string
  /** Newest first; the first is open */
  releases: { version: string; range?: React.ReactNode; items: React.ReactNode[] }[]
}

/** What changed: releases that open and close, in a dialog, with one button to close */
export function PatchNotes({ open, onClose, title, okLabel, releases }: PatchNotesProps) {
  return (
    <Dialog open={open} onClose={onClose} title={title} className="sp-notes"
      foot={<button type="button" className="sp-notes__ok" onClick={onClose}>{okLabel}</button>}>
      <div className="sp-notes__body sp-scroll--6">
        {releases.map((r, i) => (
          <details key={r.version} className="sp-notes__group" open={i === 0}>
            <summary><span className="sp-notes__version">{r.version}</span>{r.range && <span className="sp-notes__range">{r.range}</span>}</summary>
            <ul>{r.items.map((it, k) => <li key={k}>{it}</li>)}</ul>
          </details>
        ))}
      </div>
    </Dialog>
  )
}
