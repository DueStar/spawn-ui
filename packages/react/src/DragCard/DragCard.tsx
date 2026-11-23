import React from 'react'

export interface DragCardProps {
  picture: React.ReactNode
  label: string
  /** The pointer, in px */
  x: number
  y: number
}

/** A small card of the session that follows the pointer off the list */
export function DragCard({ picture, label, x, y }: DragCardProps) {
  return <div className="sp-drag-card" aria-hidden="true" style={{ left: x, top: y }}>{picture}<span>{label}</span></div>
}
