import type { Tier } from '@spawn-ui/tokens'
import React from 'react'
import { Meter } from '../Meter/Meter'

export interface StatTileProps {
  label: string
  value: number
  /** Of how many */
  of?: number
  /** 0–1, shown as % and as the bar */
  pct?: number
  /** A tier's column: its word and bar in the tier's colour */
  tier?: Tier
  className?: string
}

/** One number of the Pokédex's top: the label, the value large, its share as a thin bar */
export function StatTile({ label, value, of, pct, tier, className }: StatTileProps) {
  const p = pct === undefined ? undefined : Math.round(Math.min(1, Math.max(0, pct)) * 100)
  return (
    <div className={`sp-stat${tier ? ` sp-stat--tier tier-${tier}` : ''}${className ? ` ${className}` : ''}`}>
      <span className="sp-stat__label">{label}</span>
      <span className="sp-stat__value"><b>{value}</b>{of !== undefined && <small> / {of}</small>}</span>
      {p !== undefined && <span className="sp-stat__pct">{p}%</span>}
      {pct !== undefined && <Meter kind="stat" value={pct} label={`${label} ${p}%`} className="sp-stat__bar" />}
    </div>
  )
}
