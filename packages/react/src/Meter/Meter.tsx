import React from 'react'

export type MeterKind = 'usage' | 'hp' | 'stat'
export type MeterTone = 'ok' | 'warn' | 'danger'

/** spawn's thresholds: usage amber from 80 %, red from 90 %; HP amber at 50 % and under, red at 20 % and under */
export function meterTone(kind: MeterKind, value: number): MeterTone {
  if (kind === 'usage') return value >= 0.9 ? 'danger' : value >= 0.8 ? 'warn' : 'ok'
  if (kind === 'hp') return value <= 0.2 ? 'danger' : value <= 0.5 ? 'warn' : 'ok'
  return 'ok'
}

export interface MeterProps {
  /** usage: a 2px limit bar · hp: the 3px context bar · stat: a Pokémon's stat */
  kind: MeterKind
  /** 0–1 (clamped) */
  value: number
  /** Its name for screen readers */
  label: string
  className?: string
}

/** A thin bar (spawn's .w-bar, .w-ctx, .dex-stat-bar) */
export function Meter({ kind, value, label, className }: MeterProps) {
  const v = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0))
  const pct = Math.round(v * 100)
  return (
    <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}
      className={`sp-meter sp-meter--${kind} sp-meter--${meterTone(kind, v)}${className ? ` ${className}` : ''}`}>
      <span className="sp-meter__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
