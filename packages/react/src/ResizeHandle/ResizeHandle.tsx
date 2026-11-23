import React, { useRef } from 'react'

export interface ResizeHandleProps {
  /** Its name for screen readers (what it resizes) */
  label: string
  /** The edge of the thing it resizes: dragging right grows a left-edge … right-edge panel */
  edge: 'left' | 'right'
  /** 7 (a panel's edge, the default) or 22 (the changes panel) */
  hit?: 7 | 22
  /** The 1px line shows at rest (between panes) */
  lineAtRest?: boolean
  value: number
  min: number
  max: number
  /** ← / → change by this */
  step?: number
  onResize(value: number): void
  /** Home, or a double-click */
  onReset?(): void
  /** A drag starts (true) and ends (false): the app sets its resizing cursor */
  onDragging?(on: boolean): void
  /** A drag ended at this value (save it once) */
  onResizeEnd?(value: number): void
  title?: string
  className?: string
}

/** A draggable edge: the pointer drags it, ← / → step, Home and a double-click reset */
export function ResizeHandle({ label, edge, hit = 7, lineAtRest, value, min, max, step = 10, onResize, onReset, onDragging, onResizeEnd, title, className }: ResizeHandleProps) {
  const drag = useRef<{ x: number; v: number; last: number } | null>(null)
  const end = () => {
    const d = drag.current
    if (!d) return
    drag.current = null
    onDragging?.(false)
    onResizeEnd?.(d.last)
  }
  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  const keys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const dir = edge === 'right' ? 1 : -1
    if (e.key === 'ArrowRight') { e.preventDefault(); onResize(clamp(value + step * dir)) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); onResize(clamp(value - step * dir)) }
    else if (e.key === 'Home' && onReset) { e.preventDefault(); onReset() }
  }
  return (
    <div role="separator" aria-orientation="vertical" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={min} aria-valuemax={max} tabIndex={0} title={title}
      className={`sp-resize sp-resize--${edge}${hit === 22 ? ' sp-resize--22' : ''}${lineAtRest ? ' sp-resize--line' : ''}${className ? ` ${className}` : ''}`}
      onKeyDown={keys} onDoubleClick={() => onReset?.()}
      onPointerDown={e => {
        // the main button only (a right-click opens no drag); the pointer stays ours and selects no text
        if (e.button !== 0) return
        e.preventDefault(); e.stopPropagation()
        ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
        drag.current = { x: e.clientX, v: value, last: value }
        onDragging?.(true)
      }}
      onPointerMove={e => { const d = drag.current; if (!d) return; d.last = clamp(d.v + (e.clientX - d.x) * (edge === 'right' ? 1 : -1)); onResize(d.last) }}
      onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} />
  )
}
