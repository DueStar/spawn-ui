import React from 'react'

export interface LogRowProps {
  time: string
  /** A 32px picture */
  icon?: React.ReactNode
  /** The line (the name in <b>) */
  text: React.ReactNode
  /** The line under */
  sub?: React.ReactNode
  kind?: 'catch' | 'flee' | 'levelup'
  className?: string
}

/** One entry of the day's log */
export function LogRow({ time, icon, text, sub, kind = 'catch', className }: LogRowProps) {
  return (
    <div className={`sp-log-row sp-log-row--${kind}${className ? ` ${className}` : ''}`}>
      <span className="sp-log-row__time">{time}</span>
      {icon && <span className="sp-log-row__icon">{icon}</span>}
      <span className="sp-log-row__text"><span className="sp-log-row__line">{text}</span>{sub && <span className="sp-log-row__sub">{sub}</span>}</span>
    </div>
  )
}

/** A day's heading, pinned over its rows */
export function LogDay({ label }: { label: string }) {
  return <h3 className="sp-log-day">{label}</h3>
}
