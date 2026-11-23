import type { Tier } from '@spawn-ui/tokens'
import React from 'react'
import { PokemonSprite } from '../PokemonSprite/PokemonSprite'
import { TierLabel } from '../TierLabel/TierLabel'

export interface CatchToastProps {
  kind: 'catch' | 'flee' | 'levelup'
  sprite: string
  /** The small line on top (잡았어요) */
  eyebrow: React.ReactNode
  /** The Pokémon's name */
  title: React.ReactNode
  /** After the title, small (Lv.12) */
  titleNote?: React.ReactNode
  /** The line under (the ball, where) */
  meta?: React.ReactNode
  /** Who caught it (a session), quiet; warn turns it amber */
  via?: React.ReactNode
  viaWarn?: boolean
  tier?: Tier
  tierLabel?: string
  shiny?: boolean
  /** NEW, +N … beside the eyebrow */
  badge?: React.ReactNode
  onClose?(): void
  closeLabel?: string
  /** Leaving: it slides out */
  leaving?: boolean
  className?: string
}

/** A catch, a flight or a level-up, as a card. Its sizes are fixed: the toast never takes the text step. */
export function CatchToast({ kind, sprite, eyebrow, title, titleNote, meta, via, viaWarn, tier, tierLabel, shiny, badge, onClose, closeLabel = 'Close', leaving, className }: CatchToastProps) {
  const cls = ['sp-toast', `sp-toast--${kind}`]
  if (tier) cls.push(`tier-${tier}`)
  if (shiny) cls.push('sp-toast--shiny')
  if (leaving) cls.push('sp-toast--leaving')
  if (className) cls.push(className)
  return (
    <div role="status" className={cls.join(' ')}>
      <div className="sp-toast__art"><PokemonSprite src={sprite} size={48} silhouette={kind === 'flee'} /></div>
      <div className="sp-toast__text">
        <div className="sp-toast__eyebrow"><span className="sp-toast__kind">{eyebrow}</span>{tier && tierLabel && <TierLabel tier={tier}>{tierLabel}</TierLabel>}{badge}</div>
        <div className="sp-toast__title">{title}{titleNote && <small>{titleNote}</small>}</div>
        {meta && <div className="sp-toast__meta">{meta}</div>}
        {via && <div className={`sp-toast__via${viaWarn ? ' sp-toast__via--warn' : ''}`}>{via}</div>}
      </div>
      {onClose && <button type="button" className="sp-toast__close" aria-label={closeLabel} title={closeLabel} onClick={e => { e.stopPropagation(); onClose() }}>×</button>}
    </div>
  )
}
