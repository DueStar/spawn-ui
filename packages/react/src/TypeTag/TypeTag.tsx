import React from 'react'

export const POKEMON_TYPES = ['normal', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'fighting', 'poison', 'ground', 'flying', 'bug', 'rock', 'ghost', 'steel'] as const
export type PokemonType = (typeof POKEMON_TYPES)[number]

export interface TypeTagProps {
  type: PokemonType
  /** The type's name */
  children: React.ReactNode
  className?: string
}

/** A Pokémon's type: a hairline tag in the type's own colour, no fill */
export function TypeTag({ type, children, className }: TypeTagProps) {
  return <span className={`sp-type-tag sp-type--${type}${className ? ` ${className}` : ''}`}>{children}</span>
}
