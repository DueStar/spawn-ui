import React from 'react'
import { Meter, meterTone } from '../Meter/Meter'

export interface UsageLimit {
  label: string
  /** 0–1 used */
  pct: number
  /** When it resets, as words */
  reset: string
}

export interface UsageBarsProps {
  limits: UsageLimit[]
  /** Waiting for the first numbers: the bars shimmer */
  loading?: boolean
  /** Before any session: this hint instead */
  idle?: React.ReactNode
  className?: string
}

/** The plan's limits: label · bar · % · when it resets (amber from 80 %, red from 90 %, in words too) */
export function UsageBars({ limits, loading, idle, className }: UsageBarsProps) {
  if (idle) return <div className={`sp-usage sp-usage--idle${className ? ` ${className}` : ''}`}><span className="sp-usage__hint">{idle}</span></div>
  return (
    <div className={`sp-usage${loading ? ' sp-usage--loading' : ''}${className ? ` ${className}` : ''}`}>
      {limits.map(l => {
        const tone = meterTone('usage', l.pct)
        const pct = `${Math.round(Math.min(1, Math.max(0, l.pct)) * 100)}%`
        return (
          <div className="sp-usage__row" key={l.label}>
            <span className="sp-usage__label sp-truncate">{l.label}</span>
            <Meter kind="usage" value={l.pct} label={`${l.label} ${pct}`} />
            <span className={`sp-usage__pct${tone !== 'ok' ? ` sp-usage__pct--${tone}` : ''}`}>{pct}</span>
            <span className="sp-usage__reset">{l.reset}</span>
          </div>
        )
      })}
    </div>
  )
}
