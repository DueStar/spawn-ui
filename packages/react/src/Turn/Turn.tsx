import React from 'react'

/** Who answers, once at the turn's head */
export function TurnHead({ picture, name, time, className }: { picture?: React.ReactNode; name: string; time?: string; className?: string }) {
  return (
    <div className={`sp-turn-head${className ? ` ${className}` : ''}`}>
      {picture && <span className="sp-turn-head__pic">{picture}</span>}
      <b>{name}</b>
      {time && <span>· {time}</span>}
    </div>
  )
}

/** The quiet line after a finished turn: time, tools, files, steps, and its action (copy) at the right */
export function TurnFoot({ items, action, className }: { items: React.ReactNode[]; action?: React.ReactNode; className?: string }) {
  return (
    <div className={`sp-turn-foot${className ? ` ${className}` : ''}`}>
      {items.map((it, i) => <span key={i}>{it}</span>)}
      {action && <span className="sp-turn-foot__action">{action}</span>}
    </div>
  )
}
