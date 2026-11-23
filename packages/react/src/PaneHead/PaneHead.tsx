import React from 'react'

export interface PaneHeadProps {
  /** The pane in view */
  on?: boolean
  /** Its SessionHeader */
  children: React.ReactNode
  /** A button at its end (more) */
  more?: React.ReactNode
  className?: string
}

/** One pane's head in the split view: a session header between hairlines */
export function PaneHead({ on, children, more, className }: PaneHeadProps) {
  return <div className={`sp-pane-head${on ? ' sp-pane-head--on' : ''}${className ? ` ${className}` : ''}`}>{children}{more}</div>
}
