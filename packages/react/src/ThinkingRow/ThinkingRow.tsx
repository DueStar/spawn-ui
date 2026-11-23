import React from 'react'

/** Claude's thinking: quiet, behind a hairline */
export function ThinkingRow({ head, children, className }: { head: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`sp-think${className ? ` ${className}` : ''}`}>
      <span className="sp-think__head">{head}</span>
      {children}
    </div>
  )
}

/** An answer as it streams: quieter, replaced by the record's line */
export function LiveBubble({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`sp-live${className ? ` ${className}` : ''}`}>
      <span className="sp-live__label">{label}</span>
      <div className="sp-live__text">{children}</div>
    </div>
  )
}
