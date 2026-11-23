import React from 'react'

export interface UserMessageProps {
  text: string
  time?: string
  /** Pictures and files above the bubble */
  attachments?: React.ReactNode
  /** pending: sent, not yet in the record · queued: waiting while Claude works (faded) */
  state?: 'sent' | 'pending' | 'queued'
  /** The state in words (보내는 중, 대기 중) */
  stateLabel?: string
  className?: string
}

/** What you sent: a bubble at the right */
export function UserMessage({ text, time, attachments, state = 'sent', stateLabel, className }: UserMessageProps) {
  return (
    <div className={`sp-user${state !== 'sent' ? ` sp-user--${state}` : ''}${className ? ` ${className}` : ''}`}>
      {attachments}
      <div className="sp-user__bubble">{text}</div>
      {state !== 'sent' && stateLabel ? <span className="sp-user__state">{stateLabel}</span> : time && <span className="sp-user__time">{time}</span>}
    </div>
  )
}
