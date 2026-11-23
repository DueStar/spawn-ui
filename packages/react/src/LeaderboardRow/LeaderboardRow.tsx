import React from 'react'

export interface LeaderboardRowProps {
  place: number
  /** A 30px picture */
  icon?: React.ReactNode
  name: string
  value: React.ReactNode
  unit?: React.ReactNode
  /** The person's own row */
  me?: boolean
  /** The 나 tag's words */
  meLabel?: string
  className?: string
}

/** One place in the ranking; the top three on a metal disc */
export function LeaderboardRow({ place, icon, name, value, unit, me, meLabel, className }: LeaderboardRowProps) {
  const cls = ['sp-rank']
  if (place <= 3) cls.push('sp-rank--top', `sp-rank--top${place}`)
  if (me) cls.push('sp-rank--me')
  if (className) cls.push(className)
  return (
    <div className={cls.join(' ')}>
      <span className="sp-rank__place">{place}</span>
      <span className="sp-rank__icon">{icon}</span>
      <span className="sp-rank__name">{name}{me && meLabel && <small className="sp-rank__me">{meLabel}</small>}</span>
      <span className="sp-rank__value"><b>{value}</b>{unit}</span>
    </div>
  )
}
