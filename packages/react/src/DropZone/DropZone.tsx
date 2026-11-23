import React from 'react'

export interface DropZoneProps {
  /** Its left edge and width, as fractions (0–1) of the area it lights */
  left: number
  width: number
  /** What a drop does there */
  hint: string
  /** There is no room: the hint turns red */
  full?: boolean
}

const pct = (f: number) => `${(f * 100).toFixed(3)}%`

/** Where a dragged session would go: a lit slot over the panes, with what a drop does */
export function DropZone({ left, width, hint, full }: DropZoneProps) {
  return (
    <div className={`sp-drop-zone${full ? ' sp-drop-zone--full' : ''}`} style={{ left: pct(left), width: pct(width) }}>
      <span className="sp-drop-zone__hint" role="status">{hint}</span>
    </div>
  )
}
