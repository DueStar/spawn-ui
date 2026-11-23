import React from 'react'

export interface DexDetailCardProps {
  /** The big picture (a PokemonSprite, ≤130) */
  art: React.ReactNode
  name: React.ReactNode
  no?: string
  /** Beside the name: a 34px icon, the tier, the English name */
  nameExtra?: React.ReactNode
  /** Types, genus */
  tags?: React.ReactNode
  facts?: { label: React.ReactNode; value: React.ReactNode }[]
  flavor?: React.ReactNode
  /** The Pokémon you own (rows with their buttons) */
  owned?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

/** A Pokémon's page in the Pokédex and the Box: the art, the name, the facts */
export function DexDetailCard({ art, name, no, nameExtra, tags, facts, flavor, owned, actions, className }: DexDetailCardProps) {
  return (
    <div className={`sp-dex-card${className ? ` ${className}` : ''}`}>
      <div className="sp-dex-card__art">{art}</div>
      {no && <div className="sp-dex-card__no">{no}</div>}
      <h3 className="sp-dex-card__name">{name}{nameExtra}</h3>
      {tags && <div className="sp-dex-card__tags">{tags}</div>}
      {flavor && <p className="sp-dex-card__flavor">{flavor}</p>}
      {facts && facts.length > 0 && <dl className="sp-dex-card__facts">{facts.map((f, i) => <div key={i}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>}
      {owned}
      {actions && <div className="sp-dex-card__actions">{actions}</div>}
    </div>
  )
}
