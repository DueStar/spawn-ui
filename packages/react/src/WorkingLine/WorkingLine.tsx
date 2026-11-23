import React from 'react'
import { Button } from '../Button/Button'

export interface WorkingLineProps {
  picture?: React.ReactNode
  /** 일하는 중 · 12초 */
  text: React.ReactNode
  /** Waiting on you: the words a little brighter, the picture still */
  waiting?: boolean
  onStop?(): void
  stopLabel?: string
  className?: string
}

/** The line at the conversation's end while a session works (its picture hops) or waits */
export function WorkingLine({ picture, text, waiting, onStop, stopLabel = 'Stop', className }: WorkingLineProps) {
  return (
    <div className={`sp-working${waiting ? ' sp-working--waiting' : ''}${className ? ` ${className}` : ''}`}>
      {picture && <span className="sp-working__pic">{picture}</span>}
      <span className="sp-working__text" role="status">{text}</span>
      {onStop && <Button size="xs" className="sp-working__stop" onClick={onStop}>{stopLabel}</Button>}
    </div>
  )
}

/** A floating pill at the bottom of the conversation (new messages below) */
export function JumpPill({ label, onClick, waiting }: { label: string; onClick(): void; waiting?: boolean }) {
  return <button type="button" className={`sp-jump${waiting ? ' sp-jump--waiting' : ''}`} onClick={onClick}>{waiting && <i className="sp-jump__dot" aria-hidden="true" />}{label}</button>
}
