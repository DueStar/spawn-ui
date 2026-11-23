import type { Tier } from '@spawn-ui/tokens'
import React from 'react'

export interface StatusDotProps {
  /** neutral grey · green (working) · amber (waits on you) · danger (an error) */
  tone?: 'neutral' | 'green' | 'amber' | 'danger'
  /** A tier's colour instead of a tone */
  tier?: Tier
  /** Said to screen readers (a dot never says it by colour alone) */
  label?: string
  className?: string
}

/** A 6px dot (spawn's .tdot, .chat-dot, .w-pill-dot, .w-rail-dot, .w-sess-tab-dot) */
export function StatusDot({ tone = 'neutral', tier, label, className }: StatusDotProps) {
  const cls = tier ? `tdot tier-${tier}` : `sp-dot sp-dot--${tone}`
  return (
    <>
      <i className={`${cls}${className ? ` ${className}` : ''}`} aria-hidden="true" />
      {label && <span className="sp-visually-hidden">{label}</span>}
    </>
  )
}
