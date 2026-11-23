import type { Tier } from '@spawn-ui/tokens'
import React from 'react'

/** The tiers' words, as spawn says them (a convenience; the app may pass its own) */
export const TIER_WORDS: Record<'ko' | 'en', Record<Tier, string>> = {
  ko: { common: '일반', rare: '희귀', sub: '준전설', legendary: '전설', mythical: '환상' },
  en: { common: 'Common', rare: 'Rare', sub: 'Sub-legendary', legendary: 'Legendary', mythical: 'Mythical' },
}

export interface TierLabelProps {
  tier: Tier
  /** The word (always there: colour is never alone) */
  children: React.ReactNode
  /** 5 (the Pokédex, the toast; the default) · 4 (the log, the wild row) */
  gap?: 4 | 5
  className?: string
}

/** A tier: its dot and its word, in the tier's colour; never a filled chip */
export function TierLabel({ tier, children, gap = 5, className }: TierLabelProps) {
  return (
    <span className={`sp-tier-label tier-${tier}${gap === 4 ? ' sp-tier-label--gap-4' : ''}${className ? ` ${className}` : ''}`}>
      <i className="tdot" aria-hidden="true" />
      <span>{children}</span>
    </span>
  )
}
