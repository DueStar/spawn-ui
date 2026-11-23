import React from 'react'

export interface PillProps {
  /** working (green dot) · needs-you (amber dot, words --ink-2) · error (red dot) · idle (grey) */
  mood: 'working' | 'needs-you' | 'error' | 'idle'
  children: React.ReactNode
  title?: string
  /** A button when given (spawn: 확인 필요 opens the session) */
  onClick?(e: React.MouseEvent<HTMLButtonElement>): void
  className?: string
}

/** A session's state: its dot and its word (spawn's .w-pill) */
export function Pill({ mood, children, title, onClick, className }: PillProps) {
  const t = title ?? (typeof children === 'string' ? children : undefined)
  const cls = `sp-pill sp-pill--${mood}${onClick ? ' sp-pill--button' : ''}${className ? ` ${className}` : ''}`
  const inner = <><i className="sp-pill__dot" aria-hidden="true" /><span className="sp-truncate">{children}</span></>
  return onClick
    ? <button type="button" className={cls} title={t} onClick={onClick}>{inner}</button>
    : <span className={cls} title={t}>{inner}</span>
}
