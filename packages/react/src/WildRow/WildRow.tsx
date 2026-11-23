import type { Tier } from '@spawn-ui/tokens'
import React from 'react'
import { PokemonSprite } from '../PokemonSprite/PokemonSprite'
import { TierLabel } from '../TierLabel/TierLabel'

export interface WildRowProps {
  sprite: string
  name: string
  result: 'caught' | 'fled'
  /** The result in words */
  resultLabel: string
  /** A tier at rare or above, with its word */
  tier?: Tier
  tierLabel?: string
  /** The ball (14px) */
  ball?: React.ReactNode
  /** A small tag (NEW) */
  tag?: React.ReactNode
  /** Met while watching: the picture comes in once */
  appear?: boolean
  className?: string
}

/** A wild Pokémon met in passing, in the chat: quiet, its picture in hard pixels */
export function WildRow({ sprite, name, result, resultLabel, tier, tierLabel, ball, tag, appear, className }: WildRowProps) {
  return (
    <div className={`sp-wild sp-wild--${result}${appear ? ' sp-wild--appear' : ''}${className ? ` ${className}` : ''}`}>
      <PokemonSprite src={sprite} size={24} pixelated />
      <span className="sp-wild__line">
        <b>{name}</b>
        <span className="sp-wild__arrow" aria-hidden="true">→</span>
        <span className="sp-wild__got">{ball && <span className="sp-wild__ball">{ball}</span>}{resultLabel}</span>
        {tag}
        {tier && tierLabel && <TierLabel tier={tier} gap={4}>{tierLabel}</TierLabel>}
      </span>
    </div>
  )
}
